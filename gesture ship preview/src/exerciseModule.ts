/**
 * skiersThumbTracker.ts
 * ---------------------------------------------------------------------------
 * Headless detection module for skier's-thumb rehab exercises, built against
 * MediaPipe HandLandmarker output (21 landmarks). No UI, no DOM — you feed it
 * landmarks + a frame delta, it returns a per-frame result your game renders.
 *
 * Implements 4 exercises (plus opposition, which your existing game already has):
 *   1. thumbIpFlexion     (Level 1) - bend the thumb tip joint
 *   2. thumbMcpFlexion    (Level 2) - bend the thumb knuckle (the injured joint)
 *   3. thumbAbduction     (Level 3) - move thumb out and back, CONTROLLED + capped
 *   4. thumbToPinkyBase   (Level 4) - thumb across palm to pinky base, 6s hold
 *
 * Design notes:
 *  - Angles are scale-invariant -> used for the flex/extend exercises.
 *  - Distances are normalised by hand size -> used for the reach/hold exercises.
 *  - Everything is calibrated to EACH USER's own range (rehab ROM varies a lot).
 *  - Abduction is the injury plane for skier's thumb, so it is capped and never
 *    rewarded past target. Reward control, not maximum spread.
 *
 * Pass MediaPipe `worldLandmarks` if available (metric, robust to camera depth).
 * Plain normalised `landmarks` also work — just be consistent and calibrate with
 * the same source you run with.
 * ---------------------------------------------------------------------------
 */

// ----------------------------- Types ---------------------------------------

export interface Landmark { x: number; y: number; z: number }
export type Landmarks = Landmark[]; // expect length 21

export type ExerciseId =
  | "thumbIpFlexion"
  | "thumbMcpFlexion"
  | "thumbAbduction"
  | "thumbToPinkyBase"
  | "thumbOpposition";

export type DetectorKind = "flexExtend" | "reachHold";

export type Phase = "needsCalibration" | "relaxed" | "engaging" | "reached" | "holding" | "returning";

export interface FrameResult {
  exerciseId: ExerciseId;
  metricRaw: number;
  metric: number;        // smoothed
  progress: number;      // 0 = relaxed pose, 1 = at target; can exceed 1 (overshoot)
  phase: Phase;
  inTarget: boolean;
  holdMs: number;
  holdTargetMs: number;
  reps: number;
  repTarget: number;
  overshoot: boolean;     // exceeded the safety cap (abduction) — surface a "ease back" hint
  justCompletedRep: boolean;
  setComplete: boolean;
}

export interface ExerciseConfig {
  repTarget: number;     // reps per set
  targetFrac: number;    // fraction of calibrated range that counts as "reaching" target
  returnFrac: number;    // flexExtend: must return below this fraction to re-arm a rep
  holdTargetMs: number;  // reachHold: how long to hold in target
  safetyCapFrac: number; // overshoot flag fires above this fraction (use for abduction)
  emaAlpha: number;      // smoothing 0..1 (higher = snappier, lower = smoother)
  stableFrames: number;  // frames a state condition must persist before acting
}

// ----------------------- Landmark index constants ---------------------------

export const LM = {
  WRIST: 0,
  THUMB_CMC: 1, THUMB_MCP: 2, THUMB_IP: 3, THUMB_TIP: 4,
  INDEX_MCP: 5, INDEX_PIP: 6, INDEX_DIP: 7, INDEX_TIP: 8,
  MIDDLE_MCP: 9, MIDDLE_PIP: 10, MIDDLE_DIP: 11, MIDDLE_TIP: 12,
  RING_MCP: 13, RING_PIP: 14, RING_DIP: 15, RING_TIP: 16,
  PINKY_MCP: 17, PINKY_PIP: 18, PINKY_DIP: 19, PINKY_TIP: 20,
} as const;

// ------------------------------ Math ---------------------------------------

function dist(a: Landmark, b: Landmark): number {
  return Math.hypot(a.x - b.x, a.y - b.y, (a.z ?? 0) - (b.z ?? 0));
}

/** Per-frame hand-size reference (wrist -> middle MCP) for normalising distances. */
function handSize(lm: Landmarks): number {
  return dist(lm[LM.WRIST], lm[LM.MIDDLE_MCP]) || 1e-6;
}

function normDist(lm: Landmarks, i: number, j: number): number {
  return dist(lm[i], lm[j]) / handSize(lm);
}

/** Angle (degrees) at joint B formed by points A-B-C. Scale-invariant. */
function jointAngle(A: Landmark, B: Landmark, C: Landmark): number {
  const BA = { x: A.x - B.x, y: A.y - B.y, z: (A.z ?? 0) - (B.z ?? 0) };
  const BC = { x: C.x - B.x, y: C.y - B.y, z: (C.z ?? 0) - (B.z ?? 0) };
  const dot = BA.x * BC.x + BA.y * BC.y + BA.z * BC.z;
  const mag = Math.hypot(BA.x, BA.y, BA.z) * Math.hypot(BC.x, BC.y, BC.z) || 1e-6;
  const cos = Math.min(1, Math.max(-1, dot / mag));
  return (Math.acos(cos) * 180) / Math.PI;
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, v));
}

// -------------------------- Smoothing helper --------------------------------

class Ema {
  private s: number | undefined;
  constructor(private alpha: number) {}
  next(v: number): number {
    this.s = this.s === undefined ? v : this.alpha * v + (1 - this.alpha) * this.s;
    return this.s;
  }
  reset(): void { this.s = undefined; }
}

// ----------------------- Calibration helper ---------------------------------

/**
 * Collects metric samples while the user holds a pose, returns a robust (median)
 * value. Use once for the "relaxed" pose and once for the "engaged"/end-range pose.
 */
export class RangeCalibrator {
  private samples: number[] = [];
  add(v: number): void { this.samples.push(v); }
  reset(): void { this.samples = []; }
  get count(): number { return this.samples.length; }
  value(): number {
    if (!this.samples.length) return NaN;
    const s = [...this.samples].sort((a, b) => a - b);
    const mid = Math.floor(s.length / 2);
    return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
  }
}

// --------------------- Exercise definitions ---------------------------------

interface ExerciseDef {
  id: ExerciseId;
  name: string;
  level: number;
  detector: DetectorKind;
  /** Returns the raw metric (angle or normalised distance) for this exercise. */
  metric: (lm: Landmarks) => number;
  defaults: ExerciseConfig;
}

const DEFAULTS_FLEX: ExerciseConfig = {
  repTarget: 10, targetFrac: 0.8, returnFrac: 0.2,
  holdTargetMs: 0, safetyCapFrac: 99, emaAlpha: 0.4, stableFrames: 3,
};
const DEFAULTS_HOLD: ExerciseConfig = {
  repTarget: 10, targetFrac: 0.85, returnFrac: 0.5,
  holdTargetMs: 3000, safetyCapFrac: 99, emaAlpha: 0.4, stableFrames: 3,
};

export const EXERCISES: Record<ExerciseId, ExerciseDef> = {
  // Level 1 — bend just the tip joint. Angle at the IP joint (landmark 3).
  thumbIpFlexion: {
    id: "thumbIpFlexion", name: "Thumb tip bend", level: 1, detector: "flexExtend",
    metric: (lm) => jointAngle(lm[LM.THUMB_MCP], lm[LM.THUMB_IP], lm[LM.THUMB_TIP]),
    defaults: { ...DEFAULTS_FLEX },
  },

  // Level 2 — bend the knuckle (the injured MCP joint). Angle at landmark 2.
  thumbMcpFlexion: {
    id: "thumbMcpFlexion", name: "Thumb knuckle bend", level: 2, detector: "flexExtend",
    metric: (lm) => jointAngle(lm[LM.THUMB_CMC], lm[LM.THUMB_MCP], lm[LM.THUMB_IP]),
    defaults: { ...DEFAULTS_FLEX },
  },

  // Level 3 — controlled abduction (thumb out and back). Distance thumb tip -> index MCP,
  // which grows as the thumb moves away. CAPPED: this is the injury plane.
  // (Alternative metric: angle between vectors (lm2 - lm1) and (lm5 - lm0).)
  thumbAbduction: {
    id: "thumbAbduction", name: "Thumb out (controlled)", level: 3, detector: "reachHold",
    metric: (lm) => normDist(lm, LM.THUMB_TIP, LM.INDEX_MCP),
    defaults: { ...DEFAULTS_HOLD, holdTargetMs: 3000, targetFrac: 0.8, safetyCapFrac: 1.15 },
  },

  // Level 4 — thumb across palm to base of little finger. Distance thumb tip -> pinky MCP,
  // which shrinks as the thumb reaches across. 6-second hold. Use 3D / worldLandmarks here.
  thumbToPinkyBase: {
    id: "thumbToPinkyBase", name: "Thumb to pinky base", level: 4, detector: "reachHold",
    metric: (lm) => normDist(lm, LM.THUMB_TIP, LM.PINKY_MCP),
    defaults: { ...DEFAULTS_HOLD, holdTargetMs: 6000, targetFrac: 0.85 },
  },

  // (Optional) opposition — what your existing game already does. Included so the
  // module is a complete set. Distance thumb tip -> index tip; shrinks on contact.
  thumbOpposition: {
    id: "thumbOpposition", name: "Thumb to fingertip", level: 1, detector: "reachHold",
    metric: (lm) => normDist(lm, LM.THUMB_TIP, LM.INDEX_TIP),
    defaults: { ...DEFAULTS_HOLD, holdTargetMs: 500, targetFrac: 0.9 },
  },
};

// ------------------------- The tracker --------------------------------------

export class ExerciseTracker {
  readonly def: ExerciseDef;
  readonly cfg: ExerciseConfig;

  private ema: Ema;
  private relaxed = NaN;
  private engaged = NaN;
  private target = NaN;

  // rep state
  private reps = 0;
  private armed = true;        // flexExtend: ready to count the next rep
  private holdMs = 0;
  private holdCounted = false;
  private stableCount = 0;
  private state: "relaxed" | "engaging" | "reached" | "holding" | "returning" = "relaxed";

  constructor(id: ExerciseId, overrides: Partial<ExerciseConfig> = {}) {
    this.def = EXERCISES[id];
    this.cfg = { ...this.def.defaults, ...overrides };
    this.ema = new Ema(this.cfg.emaAlpha);
  }

  /** Sample the raw metric (use during calibration). */
  sample(lm: Landmarks): number { return this.def.metric(lm); }

  /** Provide the two calibrated extremes for THIS user. */
  setCalibration(relaxed: number, engaged: number): void {
    this.relaxed = relaxed;
    this.engaged = engaged;
    this.target = relaxed + this.cfg.targetFrac * (engaged - relaxed);
  }

  get calibrated(): boolean {
    return Number.isFinite(this.relaxed) && Number.isFinite(this.engaged);
  }

  /** Start a fresh set. */
  reset(): void {
    this.reps = 0; this.armed = true; this.holdMs = 0; this.holdCounted = false;
    this.stableCount = 0; this.state = "relaxed"; this.ema.reset();
  }

  /** Call once per frame with the chosen landmark array and ms since last frame. */
  update(lm: Landmarks, dtMs: number): FrameResult {
    const raw = this.def.metric(lm);
    const metric = this.ema.next(raw);

    if (!this.calibrated) {
      return this.frame(raw, metric, 0, "needsCalibration", false, false);
    }

    // progress: 0 at relaxed pose, 1 at target; sign handles increase vs decrease metrics.
    const span = this.target - this.relaxed || 1e-6;
    const progress = (metric - this.relaxed) / span;
    const overshoot = progress > this.cfg.safetyCapFrac;

    let justCompleted = false;

    if (this.def.detector === "flexExtend") {
      // Reach target (progress >= 1) then return (progress <= returnFrac) = 1 rep.
      if (this.armed && progress >= 1) {
        this.stableCount++;
        if (this.stableCount >= this.cfg.stableFrames) { this.state = "reached"; this.armed = false; this.stableCount = 0; }
      } else if (!this.armed && progress <= this.cfg.returnFrac) {
        this.reps++; justCompleted = true; this.armed = true; this.state = "relaxed";
      } else {
        this.stableCount = 0;
        if (this.armed) this.state = progress > 0.2 ? "engaging" : "relaxed";
        else this.state = "returning";
      }
    } else {
      // reachHold: hold inside target for holdTargetMs = 1 rep. Hysteresis on exit.
      if (progress >= 1) {
        if (this.state !== "holding") { this.state = "holding"; this.holdMs = 0; this.holdCounted = false; }
        this.holdMs += dtMs;
        if (!this.holdCounted && this.holdMs >= this.cfg.holdTargetMs) {
          this.reps++; justCompleted = true; this.holdCounted = true;
        }
      } else if (progress < this.cfg.returnFrac) {
        this.state = "relaxed"; this.holdMs = 0; this.holdCounted = false;
      } else {
        this.state = "engaging";
      }
    }

    const phase: Phase =
      this.def.detector === "flexExtend"
        ? (this.state as Phase)
        : (this.state === "holding" ? "holding" : this.state === "engaging" ? "engaging" : "relaxed");

    return this.frame(raw, metric, clamp(progress, 0, 2), phase, progress >= 1, overshoot, justCompleted);
  }

  // ---- internal ----
  private frame(
    raw: number, metric: number, progress: number, phase: Phase,
    inTarget: boolean, overshoot: boolean, justCompletedRep = false,
  ): FrameResult {
    return {
      exerciseId: this.def.id,
      metricRaw: raw,
      metric,
      progress,
      phase,
      inTarget,
      holdMs: this.holdMs,
      holdTargetMs: this.cfg.holdTargetMs,
      reps: this.reps,
      repTarget: this.cfg.repTarget,
      overshoot,
      justCompletedRep,
      setComplete: this.reps >= this.cfg.repTarget,
    };
  }
}

// ----------------------------------------------------------------------------
// EXAMPLE WIRING (remove or adapt). Shows MediaPipe HandLandmarker + a 2-step
// calibration flow + the per-frame loop. Pseudocode-ish; depends on your setup.
// ----------------------------------------------------------------------------
/*
import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";

const vision = await FilesetResolver.forVisionTasks(
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
);
const landmarker = await HandLandmarker.createFromOptions(vision, {
  baseOptions: { modelAssetPath: "hand_landmarker.task" },
  numHands: 1,
  runningMode: "VIDEO",
});

const tracker = new ExerciseTracker("thumbToPinkyBase");
const relaxCal = new RangeCalibrator();
const engageCal = new RangeCalibrator();

// --- Calibration step 1: "Hold your hand flat / thumb relaxed" for ~1s ---
//   each frame: relaxCal.add(tracker.sample(lm));
// --- Calibration step 2: "Gently reach the thumb toward your pinky base" for ~1s ---
//   each frame: engageCal.add(tracker.sample(lm));
// tracker.setCalibration(relaxCal.value(), engageCal.value());

let last = performance.now();
function loop() {
  const now = performance.now();
  const dt = now - last; last = now;

  const res = landmarker.detectForVideo(videoEl, now);
  if (res.landmarks?.length) {
    // Prefer worldLandmarks for 3D-sensitive exercises (e.g. thumbToPinkyBase):
    const lm = (res.worldLandmarks?.[0] ?? res.landmarks[0]) as Landmarks;
    const frame = tracker.update(lm, dt);

    // Render: frame.progress (0..1 -> fill a target bar), frame.inTarget,
    // frame.holdMs / frame.holdTargetMs (countdown ring), frame.reps / frame.repTarget.
    if (frame.justCompletedRep) playDing();
    if (frame.overshoot) showHint("Ease back — stay within the target.");
    if (frame.setComplete) onSetDone();
  }
  requestAnimationFrame(loop);
}
loop();
*/

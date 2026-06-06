// The opposition-exercise state machine.
//
// Feed it world landmarks + image landmarks each frame via update(); it returns a
// live view (what to show on screen this instant) and accumulates a SessionResult
// you can save when the session finishes.

import { config } from './config'
import {
  LM, TARGETS, TargetKey, Pt,
  tipDistance, thumbIpAngle, fingerPipAngle, dist2d,
} from './landmarks'

export interface TargetResult {
  key: TargetKey
  label: string
  touched: boolean        // did the thumb reach this finger (< contact distance)?
  bestDistance: number    // closest normalised distance achieved (lower = better reach)
  holdSeconds: number     // longest continuous hold while in contact
  holdMet: boolean        // held >= minHoldSeconds
  roundedOk: boolean      // joints were "slightly rounded", not straight/clenched
  curlFlag: boolean       // finger curled in to meet a lazy thumb
}

export interface RotationResult {
  targets: Record<TargetKey, TargetResult>
  slideOk: boolean
  wristStable: boolean
  formScore: number       // 0..100 for this rotation
}

// One scored "movement" = one fingertip touch (or the final slide).
export interface MovementResult {
  key: string             // finger key or 'slide'
  label: string
  score: number           // 0..10 (raw quality)
  perfect: boolean        // score === 10
  multiplier: number      // combo multiplier applied
  earned: number          // points actually added (score × multiplier, rounded)
}

export interface SessionResult {
  startedAt: number
  endedAt: number
  handedness: string
  exerciseId: string
  exerciseName: string
  reps: number            // reps completed (rotations for opposition, sets for others)
  rotations?: RotationResult[] // opposition only — per-finger detail
  formScore: number       // 0..100
  // game stats
  points: number          // sum of all movement scores this session
  movementsTotal: number  // number of movements scored
  perfectCount: number    // movements that scored 10/10
  bestStreak: number      // longest run of movements scoring >= streakThreshold
}

export interface LiveView {
  mode: 'opposition' | 'generic'
  overshoot?: boolean     // generic: exceeded the safety cap (e.g. abduction)
  phase: 'index' | 'middle' | 'ring' | 'pinky' | 'slide' | 'done'
  rotation: number        // 1-based current rotation
  targetRotations: number
  cue: string             // the big instruction
  warnings: string[]      // live form warnings
  holdProgress: number    // 0..1 toward the required hold
  calibrationDistance: number // current normalised thumb→active-finger distance
  contactDistance: number // the threshold, for the calibration bar
  finished: boolean
  // game state
  points: number
  streak: number          // current live streak
  bestStreak: number      // best streak this session
  multiplier: number      // current combo multiplier (1 when no combo)
  lastMovement: MovementResult | null // the most recently scored movement
  movementId: number      // increments each time a new movement is scored (for flash)
  sounds: string[]        // voice-clip ids to play this frame (see src/audio.ts)
}

const PHASE_ORDER: TargetKey[] = ['index', 'middle', 'ring', 'pinky']

function freshTargetResult(t: (typeof TARGETS)[number]): TargetResult {
  return {
    key: t.key, label: t.label,
    touched: false, bestDistance: Infinity, holdSeconds: 0,
    holdMet: false, roundedOk: false, curlFlag: false,
  }
}

export class OppositionTracker {
  private rotations: RotationResult[] = []
  private startedAt = 0
  private handedness = 'Unknown'

  // current rotation state
  private targetIdx = 0
  private phase: LiveView['phase'] = 'index'
  private current: Record<TargetKey, TargetResult> = {} as any
  private holdTimer = 0
  private inContact = false
  private wristStart: Pt | null = null
  private wristMaxDrift = 0
  private slideReached = false

  // game state (persists across rotations within a session)
  private points = 0
  private streak = 0
  private bestStreak = 0
  private perfectCount = 0
  private movementsTotal = 0
  private lastMovement: MovementResult | null = null
  private movementId = 0

  // voice cue queue (drained each frame by view()) + wrong-finger edge tracking
  private sounds: string[] = []
  private touchingAnyPrev = false

  constructor(handedness: string, startedAt: number) {
    this.handedness = handedness
    this.startedAt = startedAt
    this.resetRotation()
    this.emitSound('start')
    this.emitSound('next_index')
  }

  private emitSound(id: string) { this.sounds.push(id) }

  // The fingertip the thumb is currently closest to, with its normalised distance.
  private closestFingertip(world: Pt[]): { idx: number; dist: number } {
    let idx = 0
    let dist = Infinity
    for (let i = 0; i < TARGETS.length; i++) {
      const d = tipDistance(world, TARGETS[i].tip)
      if (d < dist) { dist = d; idx = i }
    }
    return { idx, dist }
  }

  private resetRotation() {
    this.targetIdx = 0
    this.phase = 'index'
    this.current = {} as any
    for (const t of TARGETS) this.current[t.key] = freshTargetResult(t)
    this.holdTimer = 0
    this.inContact = false
    this.wristStart = null
    this.wristMaxDrift = 0
    this.slideReached = false
    this.touchingAnyPrev = false
  }

  get rotationCount() { return this.rotations.length }

  update(world: Pt[], image: Pt[], dt: number): LiveView {
    const warnings: string[] = []

    // Track whole-hand drift in frame (forearm-still check) using image coords.
    if (!this.wristStart) this.wristStart = { ...image[LM.WRIST] }
    const drift = dist2d(image[LM.WRIST], this.wristStart)
    this.wristMaxDrift = Math.max(this.wristMaxDrift, drift)
    if (drift > config.wristDriftMax) warnings.push('Hold your hand steady, palm facing the camera')

    // ---- SLIDE phase (after the little finger) --------------------------
    if (this.phase === 'slide') {
      const slideD = tipDistance(world, LM.PINKY_MCP)
      if (slideD < config.slideDistance) this.slideReached = true
      const cue = this.slideReached
        ? 'Nice — slide complete'
        : 'Slide your thumb tip DOWN the little finger to its base'
      if (this.slideReached) this.completeRotation(world)
      return this.view(cue, warnings, 0, tipDistance(world, LM.PINKY_TIP))
    }

    // ---- TOUCH/HOLD phases ----------------------------------------------
    const target = TARGETS[this.targetIdx]

    // Wrong-finger check, fired once on each new contact: if the thumb lands on a
    // fingertip that isn't the expected one, call it out by name.
    const closest = this.closestFingertip(world)
    const touchingAnyNow = closest.dist < config.contactDistance
    if (touchingAnyNow && !this.touchingAnyPrev && closest.idx !== this.targetIdx) {
      this.emitSound('wrong_' + TARGETS[closest.idx].key)
    }
    this.touchingAnyPrev = touchingAnyNow

    const d = tipDistance(world, target.tip)
    const res = this.current[target.key]
    res.bestDistance = Math.min(res.bestDistance, d)

    const touching = this.inContact
      ? d < config.contactDistance + config.releaseExtra
      : d < config.contactDistance

    if (touching) {
      this.inContact = true
      res.touched = true
      this.holdTimer += dt

      // Capture form at the moment of contact.
      const ip = thumbIpAngle(world)
      const pip = fingerPipAngle(world, target.mcp, target.pip, target.tip)
      res.roundedOk =
        ip >= config.roundedMin && ip <= config.roundedMax &&
        pip >= config.roundedMin && pip <= config.roundedMax
      if (ip < config.roundedMin || pip < config.roundedMin)
        warnings.push('Ease off — keep the joints slightly rounded, not clenched')
      else if (ip > config.roundedMax || pip > config.roundedMax)
        warnings.push('Keep a gentle curve in the joints, don’t lock them straight')

      // Finger-came-to-thumb compensation.
      if (pip < config.fingerCurlFlag) {
        res.curlFlag = true
        warnings.push('Move the THUMB across to the finger — don’t curl the finger in')
      }

      if (this.holdTimer >= config.minHoldSeconds) res.holdMet = true
      res.holdSeconds = Math.max(res.holdSeconds, this.holdTimer)

      const cue = res.holdMet
        ? `Great — release and move to ${this.nextLabel()}`
        : `Touch ${target.label}: hold ${Math.ceil(config.minHoldSeconds - this.holdTimer)}…`
      return this.view(cue, warnings, Math.min(1, this.holdTimer / config.minHoldSeconds), d)
    }

    // Not touching the expected finger.
    if (this.inContact) {
      // We just released. Advance to the next target.
      this.inContact = false
      this.holdTimer = 0
      this.advance(world)
      // fall through to render the new phase's cue next frame
    }

    const cue = `Bring your thumb tip to your ${target.label} finger`
    return this.view(cue, warnings, 0, d)
  }

  private nextLabel(): string {
    if (this.targetIdx + 1 < PHASE_ORDER.length) return TARGETS[this.targetIdx + 1].label
    return config.enableSlide ? 'the slide' : 'finish the rotation'
  }

  private advance(world: Pt[]) {
    // Score the finger we just released as one "movement".
    this.recordMovement(this.current[TARGETS[this.targetIdx].key])

    // Spoken praise based on how that movement went.
    const sc = this.lastMovement ? this.lastMovement.score : 0
    this.emitSound(sc >= 10 ? 'perfect' : sc >= config.streakThreshold ? 'good' : 'hold_longer')

    if (this.targetIdx + 1 < PHASE_ORDER.length) {
      this.targetIdx++
      this.phase = PHASE_ORDER[this.targetIdx]
      this.emitSound('next_' + this.phase) // next_middle / next_ring / next_pinky
    } else if (config.enableSlide) {
      this.phase = 'slide'
      this.emitSound('next_slide')
    } else {
      this.completeRotation(world)
    }
  }

  // --- Game scoring -------------------------------------------------------
  private recordMovement(t: TargetResult) {
    this.applyMovement(t.key, t.label, scoreMovement(t))
  }

  private applyMovement(key: string, label: string, score: number) {
    const perfect = score >= 10
    this.movementsTotal++
    if (perfect) this.perfectCount++
    // Update the streak first, then the combo multiplier reflects it — so the
    // rep that reaches a new combo tier is rewarded immediately.
    if (score >= config.streakThreshold) {
      this.streak++
      this.bestStreak = Math.max(this.bestStreak, this.streak)
    } else {
      this.streak = 0
    }
    const multiplier = comboMultiplier(this.streak)
    const earned = Math.round(score * multiplier)
    this.points += earned
    this.lastMovement = { key, label, score, perfect, multiplier, earned }
    this.movementId++
  }

  private completeRotation(_world: Pt[]) {
    // The slide counts as a movement too (perfect if you reached the base).
    if (config.enableSlide) this.applyMovement('slide', 'Slide', this.slideReached ? 10 : 0)

    const wristStable = this.wristMaxDrift <= config.wristDriftMax
    const rotation: RotationResult = {
      targets: this.current,
      slideOk: config.enableSlide ? this.slideReached : true,
      wristStable,
      formScore: scoreRotation(this.current, wristStable, this.slideReached),
    }
    this.rotations.push(rotation)
    const finished = this.rotations.length >= config.targetRotations
    this.resetRotation()
    if (finished) {
      this.phase = 'done'
      this.emitSound('complete')
    } else {
      this.emitSound('rep_done')
      // Count the rep out loud as it ticks up, e.g. "Rep 2 of 10".
      this.emitSound(`say:Rep ${this.rotations.length + 1} of ${config.targetRotations}`)
      this.emitSound('next_index')
    }
  }

  private view(cue: string, warnings: string[], holdProgress: number, calib: number): LiveView {
    const finished = this.rotations.length >= config.targetRotations
    const sounds = this.sounds
    this.sounds = []
    return {
      sounds,
      mode: 'opposition',
      phase: finished ? 'done' : this.phase,
      rotation: Math.min(this.rotations.length + 1, config.targetRotations),
      targetRotations: config.targetRotations,
      cue: finished ? 'Session complete — great work' : cue,
      warnings: [...new Set(warnings)],
      holdProgress,
      calibrationDistance: calib,
      contactDistance: config.contactDistance,
      finished,
      points: this.points,
      streak: this.streak,
      bestStreak: this.bestStreak,
      multiplier: comboMultiplier(this.streak),
      lastMovement: this.lastMovement,
      movementId: this.movementId,
    }
  }

  finish(endedAt: number): SessionResult {
    const scores = this.rotations.map((r) => r.formScore)
    const formScore = scores.length
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0
    return {
      startedAt: this.startedAt,
      endedAt,
      handedness: this.handedness,
      exerciseId: 'thumbOpposition',
      exerciseName: 'Thumb to fingertip',
      reps: this.rotations.length,
      rotations: this.rotations,
      formScore,
      points: this.points,
      movementsTotal: this.movementsTotal,
      perfectCount: this.perfectCount,
      bestStreak: this.bestStreak,
    }
  }
}

// Rate one fingertip touch out of 10: reached (4) + held 5s (3) + rounded (2) + no compensation (1).
function scoreMovement(t: TargetResult): number {
  if (!t.touched) return 0
  let s = 4
  if (t.holdMet) s += 3
  if (t.roundedOk) s += 2
  if (!t.curlFlag) s += 1
  return s
}

// Combo multiplier for the current streak: first tier whose minStreak fits.
export function comboMultiplier(streak: number): number {
  for (const tier of config.comboTiers) if (streak >= tier.minStreak) return tier.mult
  return 1
}

function scoreRotation(
  targets: Record<TargetKey, TargetResult>,
  wristStable: boolean,
  slideOk: boolean,
): number {
  const list = Object.values(targets)
  const reach = list.filter((t) => t.touched).length / list.length      // got there
  const holds = list.filter((t) => t.holdMet).length / list.length      // held long enough
  const round = list.filter((t) => t.roundedOk).length / list.length    // good joint shape
  const noCurl = list.filter((t) => !t.curlFlag).length / list.length   // no compensation
  // Weighted blend.
  const score =
    reach * 35 + holds * 25 + round * 15 + noCurl * 15 +
    (wristStable ? 5 : 0) + (slideOk ? 5 : 0)
  return Math.round(score)
}

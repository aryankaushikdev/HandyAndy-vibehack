import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, RotateCw, Box } from "lucide-react";
import type * as THREE from "three";
import { EXERCISES, JOINT_AMPLITUDE } from "@/lib/exercises";
import type { ExerciseId, Finger, JointName } from "@/types";

type Props = {
  jointKey: string | null; // e.g. "index_pip"
  exerciseId: ExerciseId | null;
};

const FINGERS: Finger[] = ["index", "middle", "ring", "little"];
const JOINTS: JointName[] = ["MCP", "PIP", "DIP"];

const SEG_LEN: Record<string, number> = { mcp: 0.9, pip: 0.65, dip: 0.5 };
const FINGER_X: Record<Finger, number> = {
  index: -0.9,
  middle: -0.3,
  ring: 0.3,
  little: 0.9,
};
// Slight per-finger length variance.
const FINGER_SCALE: Record<Finger, number> = {
  index: 1.0,
  middle: 1.1,
  ring: 1.0,
  little: 0.85,
};

export function HandViewer({ jointKey, exerciseId }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<{
    cleanup?: () => void;
    setHighlight?: (key: string | null) => void;
    setExercise?: (id: ExerciseId | null) => void;
    setPlaying?: (p: boolean) => void;
    setProgress?: (p: number) => void;
  }>({});
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);

  // Build scene once
  useEffect(() => {
    let disposed = false;
    let frameId = 0;

    (async () => {
      const THREE = await import("three");
      if (disposed || !containerRef.current) return;

      const container = containerRef.current;
      const scene = new THREE.Scene();
      scene.background = null;

      const camera = new THREE.PerspectiveCamera(
        38,
        container.clientWidth / container.clientHeight,
        0.1,
        100,
      );
      camera.position.set(0, 1.5, 7.5);
      camera.lookAt(0, 1.6, 0);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(renderer.domElement);

      // Lighting
      scene.add(new THREE.AmbientLight(0xffffff, 0.55));
      const key = new THREE.DirectionalLight(0xffffff, 0.9);
      key.position.set(3, 5, 4);
      scene.add(key);
      const rim = new THREE.DirectionalLight(0x88aaff, 0.4);
      rim.position.set(-4, 2, -3);
      scene.add(rim);

      // Materials
      const boneMat = new THREE.MeshStandardMaterial({
        color: 0xdbe6f3,
        roughness: 0.55,
        metalness: 0.05,
        emissive: 0x000000,
      });
      const palmMat = new THREE.MeshStandardMaterial({
        color: 0xc7d5e6,
        roughness: 0.6,
        metalness: 0.05,
      });

      const hand = new THREE.Group();
      scene.add(hand);
      hand.position.y = 0.4;

      // Palm
      const palm = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.9, 0.6), palmMat);
      palm.position.y = 0.45;
      hand.add(palm);

      // Joints map keyed `{finger}_{joint}`
      const joints: Record<string, THREE.Object3D> = {};
      const segments: Record<string, THREE.Mesh> = {};

      for (const finger of FINGERS) {
        const fScale = FINGER_SCALE[finger];
        // Base pivot at top of palm
        const basePivot = new THREE.Group();
        basePivot.position.set(FINGER_X[finger], 0.9, 0);
        hand.add(basePivot);

        let parent: THREE.Object3D = basePivot;

        for (const joint of JOINTS) {
          const jl = joint.toLowerCase();
          const len = SEG_LEN[jl] * fScale;

          // Pivot at the start of this segment
          const pivot = new THREE.Group();
          parent.add(pivot);
          joints[`${finger}_${jl}`] = pivot;

          // Knuckle sphere
          const knuckle = new THREE.Mesh(
            new THREE.SphereGeometry(0.13, 20, 20),
            boneMat.clone(),
          );
          pivot.add(knuckle);

          // Bone cylinder extending +Y from pivot
          const bone = new THREE.Mesh(
            new THREE.CylinderGeometry(0.1, 0.085, len, 16),
            boneMat.clone(),
          );
          bone.position.y = len / 2;
          pivot.add(bone);
          segments[`${finger}_${jl}`] = bone;

          // Next pivot sits at the tip of this bone
          const next = new THREE.Group();
          next.position.y = len;
          pivot.add(next);
          parent = next;
        }

        // Fingertip cap
        const tip = new THREE.Mesh(
          new THREE.SphereGeometry(0.09, 16, 16),
          boneMat.clone(),
        );
        parent.add(tip);
      }

      // Highlight glow sphere
      const glow = new THREE.Mesh(
        new THREE.SphereGeometry(0.3, 24, 24),
        new THREE.MeshBasicMaterial({
          color: 0xffb547,
          transparent: true,
          opacity: 0.32,
        }),
      );
      glow.visible = false;
      scene.add(glow);

      let highlightKey: string | null = null;
      let currentExercise: ExerciseId | null = null;
      let isPlaying = false;
      let externalProgress = 0;
      let internalT = 0;

      const setHighlight = (key: string | null) => {
        // reset old segment material
        Object.entries(segments).forEach(([k, m]) => {
          const mat = m.material as THREE.MeshStandardMaterial;
          if (k === key) {
            mat.color.setHex(0xffd089);
            mat.emissive.setHex(0xff8a1f);
            mat.emissiveIntensity = 0.6;
          } else {
            mat.color.setHex(0xdbe6f3);
            mat.emissive.setHex(0x000000);
            mat.emissiveIntensity = 0;
          }
        });
        highlightKey = key;
        glow.visible = !!key;
      };

      const setExercise = (id: ExerciseId | null) => {
        currentExercise = id;
        // reset all rotations
        Object.values(joints).forEach((j) => {
          j.rotation.x = 0;
        });
      };

      const setPlayingFn = (p: boolean) => {
        isPlaying = p;
      };
      const setProgressFn = (p: number) => {
        externalProgress = p;
        internalT = p;
      };

      stateRef.current = {
        setHighlight,
        setExercise,
        setPlaying: setPlayingFn,
        setProgress: setProgressFn,
        cleanup: () => {
          cancelAnimationFrame(frameId);
          renderer.dispose();
          if (renderer.domElement.parentElement === container) {
            container.removeChild(renderer.domElement);
          }
          scene.traverse((o) => {
            const mesh = o as THREE.Mesh;
            if (mesh.geometry) mesh.geometry.dispose();
            if (mesh.material) {
              const m = mesh.material as THREE.Material | THREE.Material[];
              if (Array.isArray(m)) m.forEach((mm) => mm.dispose());
              else m.dispose();
            }
          });
          ro.disconnect();
        },
      };

      const ro = new ResizeObserver(() => {
        if (!container.clientWidth) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      });
      ro.observe(container);

      const tmpVec = new THREE.Vector3();

      const tick = (ts: number) => {
        frameId = requestAnimationFrame(tick);

        // Slow ambient rotation
        hand.rotation.y = Math.sin(ts * 0.0003) * 0.25;
        hand.rotation.x = -0.15;

        if (isPlaying) {
          internalT += 1 / 60 / 2.0; // 2s cycle
          if (internalT > 1) internalT = 0;
          externalProgress = internalT;
        }

        const t = isPlaying ? internalT : externalProgress;
        const ease = (1 - Math.cos(t * Math.PI * 2.2)) / 2;

        if (currentExercise) {
          const ex = EXERCISES[currentExercise];
          // reset others
          Object.entries(joints).forEach(([k, pivot]) => {
            if (!ex.joints.includes(k)) pivot.rotation.x = 0;
          });
          for (const jKey of ex.joints) {
            const pivot = joints[jKey];
            if (!pivot) continue;
            const jl = jKey.split("_")[1];
            const amp = JOINT_AMPLITUDE[jl] ?? 0.9;
            pivot.rotation.x = ease * amp;
          }
        } else {
          Object.values(joints).forEach((p) => (p.rotation.x = 0));
        }

        if (highlightKey && joints[highlightKey]) {
          joints[highlightKey].getWorldPosition(tmpVec);
          glow.position.copy(tmpVec);
        }

        renderer.render(scene, camera);
      };
      frameId = requestAnimationFrame(tick);

      setReady(true);
    })();

    return () => {
      disposed = true;
      stateRef.current.cleanup?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // React → scene
  useEffect(() => {
    stateRef.current.setHighlight?.(jointKey);
  }, [jointKey, ready]);
  useEffect(() => {
    stateRef.current.setExercise?.(exerciseId);
  }, [exerciseId, ready]);
  useEffect(() => {
    stateRef.current.setPlaying?.(playing);
  }, [playing, ready]);

  // External "scrub" only when paused
  function setProgress(v: number) {
    if (playing) return; // ignore while playing
    setProgressState(v);
    stateRef.current.setProgress?.(v);
  }

  // local state mirror so the slider follows the animation too
  const [progressState, setProgressState] = useState(0);
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setProgressState((p) => (p + 1 / 120) % 1);
    }, 16);
    return () => window.clearInterval(id);
  }, [playing]);

  const total = 45;
  const elapsed = Math.round(progressState * total);

  return (
    <section className="rounded-2xl border border-border bg-surface-muted p-3 shadow-sm overflow-hidden">
      <div className="relative">
        <div className="absolute top-3 left-3 z-10 inline-flex items-center gap-2 rounded-lg bg-card/90 backdrop-blur px-3 py-1.5 border border-border shadow-sm">
          <Box className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold">Movement Simulation</span>
        </div>
        <div ref={containerRef} className="h-[420px] w-full rounded-xl bg-gradient-to-b from-primary-soft to-surface" />
      </div>

      <div className="mt-3 flex items-center gap-3 rounded-xl bg-card border border-border px-4 py-3">
        <button
          className="h-9 w-9 inline-flex items-center justify-center rounded-full hover:bg-accent text-muted-foreground"
          onClick={() => setProgress(Math.max(0, progressState - 10 / total))}
          aria-label="Back 10s"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
        <button
          className="h-10 w-10 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground hover:opacity-90"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Pause" : "Play"}
          disabled={!exerciseId}
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
        </button>
        <button
          className="h-9 w-9 inline-flex items-center justify-center rounded-full hover:bg-accent text-muted-foreground"
          onClick={() => setProgress(Math.min(1, progressState + 10 / total))}
          aria-label="Forward 10s"
        >
          <RotateCw className="h-4 w-4" />
        </button>

        <input
          type="range"
          min={0}
          max={1000}
          value={Math.round(progressState * 1000)}
          onChange={(e) => {
            setPlaying(false);
            setProgress(Number(e.target.value) / 1000);
          }}
          className="flex-1 accent-primary"
        />
        <span className="text-xs tabular-nums text-muted-foreground">
          {fmt(elapsed)} / {fmt(total)}
        </span>
      </div>
    </section>
  );
}

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

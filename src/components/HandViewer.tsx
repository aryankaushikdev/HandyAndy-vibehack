import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, RotateCw, Box } from "lucide-react";
import type * as THREE from "three";
import modelUrl from "@/assets/hand_gesture.glb?url";
import type { ExerciseId } from "@/types";

type Props = {
  jointKey: string | null;
  exerciseId: ExerciseId | null;
};

export function HandViewer({ jointKey: _jointKey, exerciseId: _exerciseId }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<{
    cleanup?: () => void;
    setPlaying?: (p: boolean) => void;
    setProgress?: (p: number) => void;
    setLoopRange?: (start: number, end: number) => void;
  }>({});
  const [playing, setPlaying] = useState(true); // autoplay
  const [progressState, setProgressState] = useState(0);
  const [duration, setDuration] = useState(45);
  const [fullDuration, setFullDuration] = useState(1.5);
  const [loopStart, setLoopStart] = useState(0);
  const [loopEnd, setLoopEnd] = useState(1.5);

  useEffect(() => {
    let disposed = false;
    let frameId = 0;

    (async () => {
      const THREE = await import("three");
      const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
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
      camera.position.set(0, 1.5, 5);
      camera.lookAt(0, 1, 0);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(renderer.domElement);

      scene.add(new THREE.AmbientLight(0xffffff, 0.7));
      const key = new THREE.DirectionalLight(0xffffff, 0.9);
      key.position.set(3, 5, 4);
      scene.add(key);
      const rim = new THREE.DirectionalLight(0x88aaff, 0.4);
      rim.position.set(-4, 2, -3);
      scene.add(rim);

      const root = new THREE.Group();
      scene.add(root);

      let mixer: THREE.AnimationMixer | null = null;
      let action: THREE.AnimationAction | null = null;
      let clipDuration = 0;
      let loopStartT = 0;
      let loopEndT = 1.5;
      let isPlaying = true; // autoplay: animate as soon as the clip loads, looping
      let currentTime = 0;
      let direction = 1;

      const evaluateAt = (time: number, syncUi = true) => {
        if (!mixer || !action || clipDuration <= 0) return;
        currentTime = Math.max(0, Math.min(clipDuration, time));
        action.enabled = true;
        action.paused = false;
        action.setEffectiveWeight(1);
        action.setEffectiveTimeScale(1);
        mixer.setTime(currentTime);
        const span = Math.max(loopEndT - loopStartT, 0.0001);
        if (syncUi) setProgressState(Math.max(0, Math.min(1, (currentTime - loopStartT) / span)));
      };

      const loader = new GLTFLoader();
      loader.load(modelUrl, (gltf) => {
        if (disposed) return;
        const model = gltf.scene;

        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        const scale = 2.4 / maxDim;
        model.scale.setScalar(scale);
        model.position.sub(center.multiplyScalar(scale));
        model.position.y += 0.4;
        root.add(model);

        if (gltf.animations.length > 0) {
          const clip = pickFullActionClip(gltf.animations);
          clip.tracks.forEach((t) => t.setInterpolation(THREE.InterpolateLinear));
          mixer = new THREE.AnimationMixer(model);
          action = mixer.clipAction(clip);
          action.enabled = true;
          action.setEffectiveWeight(1);
          action.setEffectiveTimeScale(1);
          action.setLoop(THREE.LoopOnce, 0);
          action.clampWhenFinished = true;
          action.reset().play();
          clipDuration = clip.duration;
          loopEndT = Math.min(1.26, clipDuration);
          loopStartT = 0;
          currentTime = loopStartT;
          setFullDuration(clipDuration);
          setLoopStart(loopStartT);
          setLoopEnd(loopEndT);
          setDuration(Math.max(1, Math.ceil(clipDuration)));
          evaluateAt(currentTime, false);
        }
      });

      stateRef.current = {
        setPlaying: (p) => {
          if (p && clipDuration > 0 && (currentTime >= loopEndT || currentTime < loopStartT)) {
            evaluateAt(loopStartT);
          }
          isPlaying = p;
        },
        setProgress: (p) => {
          const span = Math.max(loopEndT - loopStartT, 0);
          evaluateAt(loopStartT + Math.max(0, Math.min(1, p)) * span);
        },
        setLoopRange: (s, e) => {
          loopStartT = Math.max(0, Math.min(s, clipDuration));
          loopEndT = Math.max(loopStartT + 0.01, Math.min(e, clipDuration));
          if (currentTime < loopStartT || currentTime > loopEndT) {
            evaluateAt(loopStartT);
          }
        },
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

      let previousTick = 0;
      const tick = (ts: number) => {
        frameId = requestAnimationFrame(tick);
        const delta = previousTick ? Math.min((ts - previousTick) / 1000, 0.05) : 0;
        previousTick = ts;
        if (mixer && action && clipDuration > 0 && isPlaying) {
          let nextTime = currentTime + delta * direction;
          if (nextTime >= loopEndT) {
            nextTime = loopEndT;
            direction = -1;
          } else if (nextTime <= loopStartT) {
            nextTime = loopStartT;
            direction = 1;
          }
          evaluateAt(nextTime);
        }
        renderer.render(scene, camera);
      };
      frameId = requestAnimationFrame(tick);
    })();

    return () => {
      disposed = true;
      stateRef.current.cleanup?.();
    };
  }, []);

  useEffect(() => {
    stateRef.current.setPlaying?.(playing);
  }, [playing]);

  useEffect(() => {
    stateRef.current.setLoopRange?.(loopStart, loopEnd);
  }, [loopStart, loopEnd]);

  function setProgress(v: number) {
    setProgressState(v);
    stateRef.current.setProgress?.(v);
  }

  const loopSpan = Math.max(loopEnd - loopStart, 0.0001);
  const elapsedSec = loopStart + progressState * loopSpan;

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
          onClick={() => setProgress(Math.max(0, progressState - 10 / duration))}
          aria-label="Back 10s"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
        <button
          className="h-10 w-10 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground hover:opacity-90"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Pause" : "Play"}
          
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
        </button>
        <button
          className="h-9 w-9 inline-flex items-center justify-center rounded-full hover:bg-accent text-muted-foreground"
          onClick={() => setProgress(Math.min(1, progressState + 10 / duration))}
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
          {elapsedSec.toFixed(2)}s / {loopEnd.toFixed(2)}s
        </span>
      </div>

    </section>
  );
}

function pickFullActionClip(clips: THREE.AnimationClip[]) {
  const movingClips = clips.filter((clip) => motionScore(clip) > 0.001);
  const preferred = ["Pose_OKHand", "Pose_PinchOnly"];
  for (const name of preferred) {
    const clip = movingClips.find((c) => c.name === name);
    if (clip) return clip;
  }

  return (movingClips.length ? movingClips : clips).reduce(
    (best, clip) => (motionScore(clip) > motionScore(best) ? clip : best),
    clips[0],
  );
}

function motionScore(clip: THREE.AnimationClip) {
  return clip.tracks.reduce((sum, track) => {
    const valueSize = track.getValueSize();
    let delta = 0;
    for (let i = valueSize; i < track.values.length; i += 1) {
      delta += Math.abs(track.values[i] - track.values[i % valueSize]);
    }
    return sum + delta;
  }, 0);
}

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

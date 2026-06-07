"use client";

import { useEffect, useRef, useState } from "react";

export type PoseSpec = {
  // flexion in degrees per joint, applied to the listed fingers
  prox?: number;
  midd?: number;
  dist?: number;
  fingers?: ("index" | "midd" | "ring" | "pinky")[];
  thumb?: { meta?: number; prox?: number; dist?: number };
};

type Props = { pose: PoseSpec; debug?: boolean };

const FINGERS = ["index", "midd", "ring", "pinky"] as const;

/**
 * Static (non-animated) posable 3D hand. We rotate the rigged finger joints to
 * reproduce the physio-handout exercise end-poses. No auto-rotation, no looping.
 */
export function ExerciseHand({ pose, debug = false }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const api = useRef<{ applyPose?: (p: PoseSpec) => void; cleanup?: () => void }>({});
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let disposed = false;
    (async () => {
      const THREE = await import("three");
      const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
      if (disposed || !containerRef.current) return;
      const container = containerRef.current;
      const w = container.clientWidth || 320;
      const h = container.clientHeight || 320;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, w / h, 0.1, 100);
      camera.position.set(0, 0.15, 3);
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(w, h);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      container.appendChild(renderer.domElement);

      scene.add(new THREE.AmbientLight(0xffffff, 1.15));
      const key = new THREE.DirectionalLight(0xffffff, 1.5);
      key.position.set(2, 3, 4);
      scene.add(key);
      const rim = new THREE.DirectionalLight(0x88aaff, 0.5);
      rim.position.set(-3, 1, -2);
      scene.add(rim);

      const pivot = new THREE.Group();
      scene.add(pivot);

      const bendAxis = new THREE.Vector3(1, 0, 0); // local flexion axis (tuned)
      const splayAxis = new THREE.Vector3(0, 1, 0);
      const bones = new Map<string, THREE.Object3D>();
      const rest = new Map<string, THREE.Quaternion>();
      const d2r = Math.PI / 180;

      const bend = (boneName: string, deg: number, axis = bendAxis) => {
        const bone = bones.get(boneName);
        const r = rest.get(boneName);
        if (!bone || !r) return;
        bone.quaternion.copy(r).multiply(new THREE.Quaternion().setFromAxisAngle(axis, deg * d2r));
      };

      const applyPose = (p: PoseSpec) => {
        // reset all to rest first
        rest.forEach((q, name) => bones.get(name)!.quaternion.copy(q));
        const fingers = p.fingers ?? [...FINGERS];
        for (const f of fingers) {
          if (p.prox) bend(`${f}_prox`, p.prox);
          if (p.midd) bend(`${f}_midd`, p.midd);
          if (p.dist) bend(`${f}_dist`, p.dist);
        }
        if (p.thumb) {
          if (p.thumb.meta) bend("thumb_meta", p.thumb.meta);
          if (p.thumb.prox) bend("thumb_prox", p.thumb.prox);
          if (p.thumb.dist) bend("thumb_dist", p.thumb.dist);
        }
      };
      api.current.applyPose = applyPose;

      const loader = new GLTFLoader();
      loader.load(
        "/models/hand.glb",
        (gltf) => {
          if (disposed) return;
          const model = gltf.scene;
          model.traverse((o) => {
            if (o.name) {
              bones.set(o.name, o);
              rest.set(o.name, o.quaternion.clone());
            }
          });
          const box = new THREE.Box3().setFromObject(model);
          const size = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z) || 1;
          const scale = 1.9 / maxDim;
          model.scale.setScalar(scale);
          model.position.sub(center.multiplyScalar(scale));
          pivot.add(model);
          applyPose(pose);
          setStatus("ready");

          if (debug) {
            (window as unknown as Record<string, unknown>).__hand = {
              THREE, bones, rest, bend, applyPose, bendAxis, splayAxis,
              render: () => renderer.render(scene, camera),
              list: () => [...bones.keys()],
            };
          }
        },
        undefined,
        () => !disposed && setStatus("error"),
      );

      let frameId = 0;
      const loop = () => {
        frameId = requestAnimationFrame(loop);
        renderer.render(scene, camera);
      };
      loop();

      api.current.cleanup = () => {
        cancelAnimationFrame(frameId);
        renderer.dispose();
        if (renderer.domElement.parentNode === container) container.removeChild(renderer.domElement);
      };
    })();
    return () => {
      disposed = true;
      api.current.cleanup?.();
      api.current = {};
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    api.current.applyPose?.(pose);
  }, [pose]);

  return (
    <div ref={containerRef} className="exhand" aria-label="3D hand exercise pose">
      {status !== "ready" && (
        <div className="exhand__overlay">{status === "error" ? "Model unavailable" : "Loading…"}</div>
      )}
    </div>
  );
}

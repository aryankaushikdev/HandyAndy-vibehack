"use client";

import { useEffect, useRef, useState } from "react";
import type * as THREE from "three";

type Props = {
  /** When true, the model loads and the scene starts rendering. */
  active: boolean;
  /** Short label describing what is being previewed (from the clinical note). */
  caption?: string;
  /** Hero/decorative mode: no control bar, transparent background. */
  bare?: boolean;
};

/**
 * Interactive 3D preview of the Blender hand model (`/models/hand.glb`).
 * Three.js is imported lazily so it never ships in the initial bundle and only
 * runs on the client once the clinician asks for a preview.
 */
export function HandViewer({ active, caption, bare = false }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<{
    cleanup?: () => void;
    setSpin?: (on: boolean) => void;
  }>({});
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [spin, setSpin] = useState(true);

  useEffect(() => {
    if (!active) return;
    let disposed = false;
    setStatus("loading");

    (async () => {
      const THREE = await import("three");
      const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
      if (disposed || !containerRef.current) return;

      const container = containerRef.current;
      const width = container.clientWidth || 480;
      const height = container.clientHeight || 360;

      const scene = new THREE.Scene();
      scene.background = null;

      const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
      camera.position.set(0, 0.2, 3);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      container.appendChild(renderer.domElement);

      // Lighting — NHS-clean, soft clinical lighting.
      scene.add(new THREE.AmbientLight(0xffffff, 1.1));
      const key = new THREE.DirectionalLight(0xffffff, 1.6);
      key.position.set(2, 3, 4);
      scene.add(key);
      const rim = new THREE.DirectionalLight(0x88aaff, 0.6);
      rim.position.set(-3, 1, -2);
      scene.add(rim);

      let model: THREE.Object3D | null = null;
      let mixer: THREE.AnimationMixer | null = null;
      const clock = new THREE.Clock();
      const pivot = new THREE.Group();
      scene.add(pivot);

      const loader = new GLTFLoader();
      loader.load(
        "/models/hand.glb",
        (gltf) => {
          if (disposed) return;
          model = gltf.scene;

          // Center + scale the model to fit the viewport nicely.
          const box = new THREE.Box3().setFromObject(model);
          const size = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z) || 1;
          const scale = 1.8 / maxDim;
          model.scale.setScalar(scale);
          model.position.sub(center.multiplyScalar(scale));
          pivot.add(model);

          if (gltf.animations?.length) {
            mixer = new THREE.AnimationMixer(model);
            // The model ships 3 pose clips (Pose_OK, Pose_OKHand, Pose_PinchOnly).
            // Playing them all at once blends conflicting skeleton poses → the
            // "weird" motion. Play ONLY the index↔thumb pinch, ping-pong looped
            // so the hand touches and releases on repeat.
            const find = (re: RegExp) => gltf.animations.find((c) => re.test(c.name));
            const clip = find(/pinch/i) || find(/\bok\b|^pose_ok$/i) || gltf.animations[0];
            const action = mixer.clipAction(clip);
            action.reset();
            action.setLoop(THREE.LoopPingPong, Infinity);
            action.clampWhenFinished = false;
            action.play();
          }
          setStatus("ready");
        },
        undefined,
        () => {
          if (!disposed) setStatus("error");
        },
      );

      let spinning = true;
      apiRef.current.setSpin = (on: boolean) => {
        spinning = on;
      };

      let frameId = 0;
      const animate = () => {
        frameId = requestAnimationFrame(animate);
        const dt = clock.getDelta();
        if (mixer) mixer.update(dt);
        if (spinning && pivot) pivot.rotation.y += dt * 0.6;
        renderer.render(scene, camera);
      };
      animate();

      const onResize = () => {
        const w = container.clientWidth || width;
        const h = container.clientHeight || height;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", onResize);

      apiRef.current.cleanup = () => {
        cancelAnimationFrame(frameId);
        window.removeEventListener("resize", onResize);
        renderer.dispose();
        if (renderer.domElement.parentNode === container) {
          container.removeChild(renderer.domElement);
        }
      };
    })();

    return () => {
      disposed = true;
      apiRef.current.cleanup?.();
      apiRef.current = {};
    };
  }, [active]);

  useEffect(() => {
    apiRef.current.setSpin?.(spin);
  }, [spin]);

  return (
    <div className={bare ? "hand3d hand3d--bare" : "hand3d"}>
      <div ref={containerRef} className="hand3d__canvas" aria-label="Interactive 3D hand model">
        {status !== "ready" && (
          <div className="hand3d__overlay">
            {status === "loading" && <span>Loading 3D hand model…</span>}
            {status === "error" && <span>Could not load the 3D model.</span>}
            {status === "idle" && <span>3D preview will appear here.</span>}
          </div>
        )}
      </div>
      {!bare && (
      <div className="hand3d__bar">
        <span className="hand3d__tag">{caption ?? "HandyAndy 3D model"}</span>
        <button
          type="button"
          className="icon-button"
          aria-pressed={spin}
          onClick={() => setSpin((s) => !s)}
          title={spin ? "Pause rotation" : "Rotate model"}
        >
          {spin ? "⏸ Rotation" : "↻ Rotate"}
        </button>
      </div>
      )}
    </div>
  );
}

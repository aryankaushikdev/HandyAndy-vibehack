'use client'

// ─────────────────────────────────────────────────────────────────────────────
// ThreeDCanvas — Three.js GLB viewer ported from HandyAndy HandViewer.tsx
// Loads /public/models/hand-gesture.glb and plays its animation.
// Bounce-loops between loopStart and loopEnd, reversing direction at each end.
// Falls back silently — onError() called so parent can show SVG placeholder.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from 'react'

interface ThreeDCanvasProps {
  modelUrl?: string
  onError?: () => void
}

export default function ThreeDCanvas({
  modelUrl = '/models/hand-gesture.glb',
  onError,
}: ThreeDCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const stateRef    = useRef<{
    setPlaying?: (p: boolean) => void
    setProgress?: (p: number) => void
    cleanup?:    () => void
  }>({})

  const [playing,  setPlayingState]  = useState(true)
  const [progress, setProgressState] = useState(0)
  const [loaded,   setLoaded]        = useState(false)

  // ── Three.js lifecycle ───────────────────────────────────────────────────
  useEffect(() => {
    let disposed = false
    let frameId  = 0

    ;(async () => {
      try {
        const THREE      = await import('three')
        const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js')
        if (disposed || !containerRef.current) return

        const container = containerRef.current
        const scene     = new THREE.Scene()
        scene.background = null

        const camera = new THREE.PerspectiveCamera(
          38,
          container.clientWidth / Math.max(container.clientHeight, 1),
          0.1,
          100,
        )
        camera.position.set(0, 1.5, 5)
        camera.lookAt(0, 1, 0)

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.setSize(container.clientWidth, container.clientHeight)
        renderer.setClearColor(0x000000, 0)
        container.appendChild(renderer.domElement)

        // Lighting — clinical, clean
        scene.add(new THREE.AmbientLight(0xffffff, 0.7))
        const key = new THREE.DirectionalLight(0xffffff, 0.9)
        key.position.set(3, 5, 4)
        scene.add(key)
        const rim = new THREE.DirectionalLight(0x88aaff, 0.4)
        rim.position.set(-4, 2, -3)
        scene.add(rim)

        const root = new THREE.Group()
        scene.add(root)

        // Animation state
        let mixer: InstanceType<typeof THREE.AnimationMixer> | null = null
        let action: ReturnType<InstanceType<typeof THREE.AnimationMixer>['clipAction']> | null = null
        let clipDuration = 0
        let loopStart  = 0
        let loopEnd    = 1.5
        let isPlaying  = true
        let currentTime = 0
        let direction  = 1

        const evaluateAt = (time: number) => {
          if (!mixer || !action || clipDuration <= 0) return
          currentTime = Math.max(0, Math.min(clipDuration, time))
          action.enabled = true
          action.paused  = false
          action.setEffectiveWeight(1)
          action.setEffectiveTimeScale(1)
          mixer.setTime(currentTime)
          const span = Math.max(loopEnd - loopStart, 0.0001)
          setProgressState(Math.max(0, Math.min(1, (currentTime - loopStart) / span)))
        }

        const loader = new GLTFLoader()
        loader.load(
          modelUrl,
          (gltf: any) => {
            if (disposed) return
            const model = gltf.scene

            // Auto-fit model to viewport
            const box    = new THREE.Box3().setFromObject(model)
            const size   = box.getSize(new THREE.Vector3())
            const center = box.getCenter(new THREE.Vector3())
            const maxDim = Math.max(size.x, size.y, size.z) || 1
            const scale  = 2.4 / maxDim
            model.scale.setScalar(scale)
            model.position.sub(center.multiplyScalar(scale))
            model.position.y += 0.4
            root.add(model)

            if (gltf.animations.length > 0) {
              // Pick the clip with most movement (mirrors HandViewer's pickFullActionClip)
              const clip = pickBestClip(gltf.animations)
              clip.tracks.forEach((t: any) => t.setInterpolation(THREE.InterpolateLinear))
              mixer  = new THREE.AnimationMixer(model)
              action = mixer.clipAction(clip)
              action.enabled = true
              action.setEffectiveWeight(1)
              action.setEffectiveTimeScale(1)
              action.setLoop(THREE.LoopOnce, 0)
              action.clampWhenFinished = true
              action.reset().play()
              clipDuration = clip.duration
              loopEnd    = Math.min(1.26, clipDuration)
              loopStart  = 0
              currentTime = loopStart
              evaluateAt(currentTime)
            }
            setLoaded(true)
          },
          undefined,
          (err: unknown) => {
            console.error('[ThreeDCanvas] GLB load error:', err)
            onError?.()
          },
        )

        stateRef.current = {
          setPlaying: (p: boolean) => {
            if (p && clipDuration > 0 &&
                (currentTime >= loopEnd || currentTime < loopStart)) {
              evaluateAt(loopStart)
            }
            isPlaying = p
          },
          setProgress: (p: number) => {
            const span = Math.max(loopEnd - loopStart, 0)
            evaluateAt(loopStart + Math.max(0, Math.min(1, p)) * span)
          },
          cleanup: () => {
            cancelAnimationFrame(frameId)
            renderer.dispose()
            if (renderer.domElement.parentElement === container) {
              container.removeChild(renderer.domElement)
            }
            root.traverse((o: any) => {
              if (o.geometry) o.geometry.dispose()
              if (o.material) {
                const m = o.material
                if (Array.isArray(m)) m.forEach((mm: any) => mm.dispose())
                else m.dispose()
              }
            })
            ro.disconnect()
          },
        }

        const ro = new ResizeObserver(() => {
          if (!container.clientWidth) return
          camera.aspect = container.clientWidth / Math.max(container.clientHeight, 1)
          camera.updateProjectionMatrix()
          renderer.setSize(container.clientWidth, container.clientHeight)
        })
        ro.observe(container)

        // Bounce-loop render tick
        let previousTick = 0
        const tick = (ts: number) => {
          frameId = requestAnimationFrame(tick)
          const delta = previousTick
            ? Math.min((ts - previousTick) / 1000, 0.05)
            : 0
          previousTick = ts
          if (mixer && action && clipDuration > 0 && isPlaying) {
            let nextTime = currentTime + delta * direction
            if (nextTime >= loopEnd)    { nextTime = loopEnd;   direction = -1 }
            else if (nextTime <= loopStart) { nextTime = loopStart; direction =  1 }
            evaluateAt(nextTime)
          }
          renderer.render(scene, camera)
        }
        frameId = requestAnimationFrame(tick)
      } catch (err) {
        console.error('[ThreeDCanvas] init error:', err)
        onError?.()
      }
    })()

    return () => {
      disposed = true
      stateRef.current.cleanup?.()
    }
  }, [modelUrl, onError])

  useEffect(() => { stateRef.current.setPlaying?.(playing) }, [playing])

  const handleScrub = (v: number) => {
    setPlayingState(false)
    setProgressState(v)
    stateRef.current.setProgress?.(v)
  }

  return (
    <div className="flex flex-col">
      {/* Viewer */}
      <div
        className="relative overflow-hidden"
        style={{
          aspectRatio: '1 / 1',
          background: 'linear-gradient(135deg, #0d1b2a 0%, #1a3a5c 50%, #0a1628 100%)',
        }}
      >
        {/* Anatomical grid */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,94,184,0.07) 1px, transparent 1px),' +
              'linear-gradient(90deg, rgba(0,94,184,0.07) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Three.js canvas mounts here */}
        <div ref={containerRef} className="absolute inset-0" />

        {/* Loading state */}
        {!loaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
            <span className="ai-spinner" aria-hidden="true" />
            <span className="text-white text-[14px] opacity-75">Loading 3D model…</span>
          </div>
        )}

        {/* Live badge */}
        {loaded && (
          <div className="absolute top-3 left-3 flex items-center gap-2 bg-gds-black/80 px-2 py-1 z-10">
            <span className="live-pulse-dot" aria-hidden="true" />
            <span className="text-white text-[12px] font-bold">3D Model</span>
          </div>
        )}

        {/* Scan line animation */}
        <div
          aria-hidden="true"
          className="absolute left-0 right-0 h-[2px] pointer-events-none opacity-25"
          style={{
            background:
              'linear-gradient(90deg,transparent,rgba(0,94,184,0.8),rgba(255,221,0,1),rgba(0,94,184,0.8),transparent)',
            animation: 'scan-line 3s ease-in-out infinite',
          }}
        />
      </div>

      {/* GDS-styled playback controls */}
      <div className="bg-gds-black flex items-center gap-2 px-3 py-2">
        <button
          onClick={() => setPlayingState((p) => !p)}
          className="bg-nhs-blue text-white p-2 hover:bg-primary-container transition-colors focus:outline-none focus:ring-2 focus:ring-nhs-focus-yellow flex-shrink-0"
          aria-label={playing ? 'Pause 3D animation' : 'Play 3D animation'}
          title={playing ? 'Pause' : 'Play'}
        >
          <span className="material-symbols-outlined material-symbols-filled text-[18px]" aria-hidden="true">
            {playing ? 'pause' : 'play_arrow'}
          </span>
        </button>

        <input
          type="range"
          className="flex-1 gds-range"
          style={{ height: '4px' }}
          min={0}
          max={1000}
          value={Math.round(progress * 1000)}
          onChange={(e) => handleScrub(Number(e.target.value) / 1000)}
          aria-label="Animation scrubber"
        />

        <button
          onClick={() => handleScrub(0)}
          className="bg-gds-grey-mid text-gds-black p-2 hover:bg-nhs-focus-yellow transition-colors focus:outline-none focus:ring-2 focus:ring-nhs-focus-yellow flex-shrink-0"
          aria-label="Reset animation to beginning"
          title="Reset"
        >
          <span className="material-symbols-outlined text-[18px]" aria-hidden="true">replay</span>
        </button>
      </div>
    </div>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function motionScore(clip: any): number {
  return clip.tracks.reduce((sum: number, track: any) => {
    const vs = track.getValueSize()
    let d = 0
    for (let i = vs; i < track.values.length; i++) {
      d += Math.abs(track.values[i] - track.values[i % vs])
    }
    return sum + d
  }, 0)
}

function pickBestClip(clips: any[]): any {
  const moving = clips.filter((c) => motionScore(c) > 0.001)
  for (const name of ['Pose_OKHand', 'Pose_PinchOnly']) {
    const found = moving.find((c) => c.name === name)
    if (found) return found
  }
  return (moving.length ? moving : clips).reduce(
    (best, c) => (motionScore(c) > motionScore(best) ? c : best),
    clips[0],
  )
}

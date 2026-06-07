import './style.css'
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision'
import type { NormalizedLandmark } from '@mediapipe/tasks-vision'
import { OppositionTracker, type LiveView, type SessionResult } from './exercise'
import { GenericGameSession } from './genericSession'
import { EXERCISES, RangeCalibrator, type ExerciseId, type Landmarks } from './exerciseModule'
import { LM, TARGETS, type Pt } from './landmarks'
import { saveSession } from './storage'
import { localSummary, sessionDigest } from './summary'
import { voice } from './audio'
import {
  renderLive, showReport, showHistoryOnly, showMenu, renderMenu, setStatus,
  startGameHud, setCalibrating, renderCalibration, type MenuItem,
} from './ui'

const video = document.getElementById('cam') as HTMLVideoElement
const canvas = document.getElementById('overlay') as HTMLCanvasElement
const ctx = canvas.getContext('2d')!

// Both session types expose the same shape.
interface PlaySession {
  update(world: Pt[], image: Pt[], dt: number): LiveView
  finish(endedAt: number): SessionResult
}

let landmarker: HandLandmarker | null = null
let session: PlaySession | null = null
let appMode: 'idle' | 'calibrate' | 'live' = 'idle'
let lastTime = 0
let lastVideoTime = -1

const CALIB_MS = 3000
let calib: {
  id: ExerciseId; step: 0 | 1; relax: RangeCalibrator; engage: RangeCalibrator; timer: number
} | null = null

const MENU: MenuItem[] = [
  { id: 'thumbOpposition', name: 'Thumb to fingertip', level: 1, desc: 'Touch your thumb to each fingertip in turn, then slide down the little finger.' },
  { id: 'thumbIpFlexion', name: 'Thumb tip bend', level: 1, desc: 'Bend just the tip joint of your thumb, then straighten.' },
  { id: 'thumbMcpFlexion', name: 'Thumb knuckle bend', level: 2, desc: 'Bend the thumb knuckle — the injured joint — then straighten.' },
  { id: 'thumbAbduction', name: 'Thumb out (controlled)', level: 3, desc: 'Move the thumb out and back, slowly and in control. Capped for safety.' },
  { id: 'thumbToPinkyBase', name: 'Thumb to pinky base', level: 4, desc: 'Reach the thumb across the palm to the little-finger base and hold.' },
]

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------
async function init() {
  try {
    const vision = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/wasm',
    )
    const modelAssetPath =
      'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task'
    try {
      landmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: { modelAssetPath, delegate: 'GPU' }, runningMode: 'VIDEO', numHands: 1,
      })
    } catch (gpuErr) {
      console.warn('GPU delegate failed, falling back to CPU', gpuErr)
      landmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: { modelAssetPath, delegate: 'CPU' }, runningMode: 'VIDEO', numHands: 1,
      })
    }
    renderMenu(MENU, selectExercise)
    showMenu()
  } catch (err) {
    setStatus('Could not load the hand tracker. Check your connection and reload.')
    console.error(err)
  }
}

async function startCamera() {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
    audio: false,
  })
  video.srcObject = stream
  await video.play()
  sizeCanvas()
}

function sizeCanvas() {
  const dpr = window.devicePixelRatio || 1
  canvas.width = canvas.clientWidth * dpr
  canvas.height = canvas.clientHeight * dpr
}
window.addEventListener('resize', sizeCanvas)

// ---------------------------------------------------------------------------
// Exercise selection (menu item click = user gesture → can unlock audio/camera)
// ---------------------------------------------------------------------------
async function selectExercise(id: string) {
  if (!landmarker) {
    alert('The hand tracker is still loading. Please wait a moment and try again.')
    return
  }
  voice.unlock()
  document.getElementById('menu')!.hidden = true
  document.getElementById('live')!.hidden = false
  setStatus('Starting camera… allow camera access when your browser asks.')
  try {
    if (!video.srcObject) await startCamera()
    else sizeCanvas()
  } catch (err) {
    // Stay on the live screen so the message is actually visible (it lives inside
    // the live section). Bouncing back to the menu hid it and looked like a no-op.
    console.error('Camera error:', err)
    const e = err as { name?: string; message?: string }
    const reason =
      e?.name === 'NotAllowedError'
        ? 'Camera permission was blocked. Click the camera icon in your browser’s address bar, allow access, then press “Back to menu” and pick the exercise again.'
        : e?.name === 'NotFoundError'
          ? 'No camera was found on this device.'
          : !window.isSecureContext
            ? 'The camera needs a secure connection. Open this on http://localhost or over HTTPS (phones need HTTPS).'
            : `Camera unavailable: ${e?.message ?? err}`
    setStatus(reason)
    return
  }
  lastTime = 0

  if (id === 'thumbOpposition') {
    setCalibrating(false)
    session = new OppositionTracker('Right', performance.now())
    startGameHud()
    appMode = 'live'
    setStatus('Thumb tip to each fingertip, hold 5s, in order.')
  } else {
    // The other 4 exercises calibrate to your own range first.
    setCalibrating(true)
    calib = { id: id as ExerciseId, step: 0, relax: new RangeCalibrator(), engage: new RangeCalibrator(), timer: 0 }
    voice.play('relax_pose')
    appMode = 'calibrate'
    setStatus('Calibrating — follow the prompts.')
  }
  requestAnimationFrame(loop)
}

// ---------------------------------------------------------------------------
// Render loop
// ---------------------------------------------------------------------------
function toPts(arr: NormalizedLandmark[]): Pt[] {
  return arr.map((p) => ({ x: p.x, y: p.y, z: p.z }))
}

function loop() {
  if (appMode === 'idle' || !landmarker) return
  const now = performance.now()

  if (video.currentTime !== lastVideoTime && video.readyState >= 2) {
    const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.25) : 0
    lastTime = now
    lastVideoTime = video.currentTime
    const res = landmarker.detectForVideo(video, now)
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (res.landmarks?.length && res.worldLandmarks?.length) {
      const image = toPts(res.landmarks[0])
      const world = toPts(res.worldLandmarks[0])
      drawHand(image)

      if (appMode === 'calibrate') {
        handleCalibration(world, dt * 1000)
      } else if (session) {
        const view = session.update(world, image, dt)
        renderLive(view)
        for (const s of view.sounds) voice.play(s)
        if (view.finished) { finishSession(); return }
      }
    } else {
      setStatus('Show your whole hand to the camera')
    }
  }
  requestAnimationFrame(loop)
}

function handleCalibration(world: Pt[], dtMs: number) {
  if (!calib) return
  const metric = EXERCISES[calib.id].metric(world as unknown as Landmarks)
  ;(calib.step === 0 ? calib.relax : calib.engage).add(metric)
  calib.timer += dtMs
  const remaining = Math.max(1, Math.ceil((CALIB_MS - calib.timer) / 1000))
  const text = calib.step === 0
    ? `Hold your hand relaxed… ${remaining}`
    : `Now reach as far as is comfortable, and hold… ${remaining}`
  renderCalibration(text, calib.timer / CALIB_MS)

  if (calib.timer >= CALIB_MS) {
    if (calib.step === 0) {
      calib.step = 1
      calib.timer = 0
      voice.play('reach_pose')
    } else {
      const relaxed = calib.relax.value()
      const engaged = calib.engage.value()
      session = new GenericGameSession(calib.id, relaxed, engaged, performance.now())
      calib = null
      voice.play('calibrated')
      setCalibrating(false)
      startGameHud()
      appMode = 'live'
    }
  }
}

// ---------------------------------------------------------------------------
// Drawing
// ---------------------------------------------------------------------------
const CONNECTIONS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8],
  [9, 10], [10, 11], [11, 12], [13, 14], [14, 15], [15, 16],
  [0, 17], [17, 18], [18, 19], [19, 20], [5, 9], [9, 13], [13, 17],
]

function coverMap(p: Pt): [number, number] {
  const cw = canvas.width, ch = canvas.height
  const vw = video.videoWidth || cw, vh = video.videoHeight || ch
  const scale = Math.max(cw / vw, ch / vh)
  const dw = vw * scale, dh = vh * scale
  const ox = (cw - dw) / 2, oy = (ch - dh) / 2
  return [ox + p.x * vw * scale, oy + p.y * vh * scale]
}

function drawHand(image: Pt[]) {
  ctx.lineWidth = Math.max(2, canvas.width * 0.004)
  ctx.strokeStyle = 'rgba(255,255,255,.55)'
  for (const [a, b] of CONNECTIONS) {
    const [x1, y1] = coverMap(image[a])
    const [x2, y2] = coverMap(image[b])
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke()
  }
  for (let i = 0; i < image.length; i++) {
    const [x, y] = coverMap(image[i])
    ctx.beginPath(); ctx.arc(x, y, canvas.width * 0.006, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.fill()
  }
  const tip = coverMap(image[LM.THUMB_TIP])
  ctx.beginPath(); ctx.arc(tip[0], tip[1], canvas.width * 0.014, 0, Math.PI * 2)
  ctx.fillStyle = '#00703c'; ctx.fill()
  for (const t of TARGETS) {
    const [x, y] = coverMap(image[t.tip])
    ctx.beginPath(); ctx.arc(x, y, canvas.width * 0.01, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(0,112,60,.5)'; ctx.fill()
  }
}

// ---------------------------------------------------------------------------
// Session lifecycle + navigation
// ---------------------------------------------------------------------------
async function finishSession() {
  if (!session) return
  appMode = 'idle'
  const s = session.finish(performance.now())
  s.endedAt = Date.now()
  s.startedAt = Date.now() - (performance.now() - s.startedAt)
  saveSession(s)
  const lines = await coachLines(s)
  showReport(s, lines)
  session = null
}

function abandonToMenu() {
  appMode = 'idle'
  session = null
  calib = null
  setCalibrating(false)
  showMenu()
}

async function coachLines(s: SessionResult): Promise<string[]> {
  try {
    const ctrl = new AbortController()
    const t = setTimeout(() => ctrl.abort(), 8000)
    const r = await fetch('/api/coach', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify(sessionDigest(s)), signal: ctrl.signal,
    })
    clearTimeout(t)
    if (r.ok) {
      const data = (await r.json()) as { lines?: string[] }
      if (data.lines?.length) return data.lines
    }
  } catch { /* endpoint not configured */ }
  return localSummary(s)
}

// ---------------------------------------------------------------------------
// Buttons
// ---------------------------------------------------------------------------
document.getElementById('stop')!.addEventListener('click', () => {
  if (appMode === 'live') finishSession()
  else abandonToMenu()
})
document.getElementById('live-menu')!.addEventListener('click', abandonToMenu)
document.getElementById('menu-progress')!.addEventListener('click', showHistoryOnly)
document.getElementById('back')!.addEventListener('click', showMenu)

const voiceBtn = document.getElementById('menu-voice') as HTMLButtonElement
function renderVoiceBtn() { voiceBtn.textContent = voice.enabled ? '🔊 Voice: on' : '🔇 Voice: off' }
voiceBtn.addEventListener('click', () => { voice.setEnabled(!voice.enabled); renderVoiceBtn() })
renderVoiceBtn()

document.getElementById('export')!.addEventListener('click', () => {
  const blob = new Blob([localStorage.getItem('thumb-coach.sessions.v1') || '[]'], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = 'thumb-coach-sessions.json'; a.click()
  URL.revokeObjectURL(url)
})
document.getElementById('clear')!.addEventListener('click', () => {
  if (confirm('Delete all saved sessions on this device?')) {
    localStorage.removeItem('thumb-coach.sessions.v1')
    showHistoryOnly()
  }
})

init()

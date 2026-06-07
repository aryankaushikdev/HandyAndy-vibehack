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
  startGameHud, setCalibrating, renderCalibration, setCalibBanner, type MenuItem,
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

const GETREADY_MS = 1800 // "get into position" before each capture (no sampling)
const CAPTURE_MS = 3000  // hold the pose while we sample
// Two metric values whose difference must exceed this (normalised) or the two poses
// were too similar — we re-run calibration so random motion can't score later.
const MIN_RANGE = 0.06
let calib: {
  id: ExerciseId
  step: 0 | 1            // 0 = engaged pose, 1 = relaxed pose (so we end at rest)
  phase: 'ready' | 'capture'
  relax: RangeCalibrator
  engage: RangeCalibrator
  timer: number
} | null = null

const MENU: MenuItem[] = [
  { id: 'thumbOpposition', name: 'Thumb to fingertip', level: 1, desc: 'Touch your thumb to each fingertip in turn, then slide down the little finger.' },
  { id: 'thumbIpFlexion', name: 'Thumb tip bend', level: 1, desc: 'Bend just the tip joint of your thumb, then straighten.' },
  { id: 'thumbMcpFlexion', name: 'Thumb knuckle bend', level: 2, desc: 'Bend your thumb in toward your palm, then straighten.' },
  { id: 'thumbAbduction', name: 'Thumb out (controlled)', level: 3, desc: 'Move the thumb out and back, slowly and in control. Capped for safety.' },
  { id: 'thumbToPinkyBase', name: 'Thumb to pinky base', level: 4, desc: 'Reach the thumb across the palm to the little-finger base and hold.' },
]

// Exercise-specific calibration prompts. A clear, deliberate calibration (a real
// difference between the relaxed and engaged poses) is what stops random wiggles
// from scoring later — so the wording tells the user exactly what to do.
// Step 0 captures the ENGAGED pose, step 1 the RELAXED pose — so calibration ends
// at rest and each rep then starts from rest (empty progress bar), not mid-reach.
const CALIB_PROMPTS: Record<string, { engage: string; relax: string }> = {
  thumbIpFlexion: { engage: 'Bend just the tip of your thumb as far as is comfy', relax: 'Now straighten it and relax' },
  thumbMcpFlexion: { engage: 'Bend your thumb in toward your palm as far as is comfy', relax: 'Now move it back out and relax' },
  thumbAbduction: { engage: 'Move your thumb out to the side, away from your fingers', relax: 'Now bring it back in beside your hand' },
  thumbToPinkyBase: { engage: 'Reach your thumb across to your little-finger base', relax: 'Now open your hand back out to rest' },
}
function calibPrompt(id: string, step: 0 | 1): string {
  const c = CALIB_PROMPTS[id]
  if (!c) return step === 0 ? 'Reach as far as is comfortable' : 'Now return to the start and relax'
  return step === 0 ? c.engage : c.relax
}

// How to hold your hand so the camera reads the thumb well, shown during calibration.
const SETUP_HINT: Record<string, string> = {
  thumbIpFlexion: 'Back of your hand to the camera, held flat and level.',
  thumbMcpFlexion: 'Back of your hand to the camera, held flat and level.',
  thumbAbduction: 'Palm to the camera so it can see your thumb move out.',
  thumbToPinkyBase: 'Palm to the camera so it can see your thumb reach across.',
}
function showCalibBanner(id: string, step: 0 | 1) {
  setCalibBanner(`Calibration · Pose ${step + 1} of 2`, SETUP_HINT[id] || '')
}

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
  if (!landmarker) return
  voice.unlock()
  document.getElementById('menu')!.hidden = true
  document.getElementById('live')!.hidden = false
  try {
    if (!video.srcObject) await startCamera()
    else sizeCanvas()
  } catch {
    setStatus('Camera permission is needed. Allow access, then pick the exercise again.')
    showMenu()
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
    calib = { id: id as ExerciseId, step: 0, phase: 'ready', relax: new RangeCalibrator(), engage: new RangeCalibrator(), timer: 0 }
    showCalibBanner(id, 0)
    voice.play('say:Let\'s calibrate. ' + calibPrompt(id, 0))
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
  calib.timer += dtMs
  const prompt = calibPrompt(calib.id, calib.step)

  if (calib.phase === 'ready') {
    // Get into position — we don't sample yet, so the move into the pose doesn't
    // pollute the readings.
    const remaining = Math.max(1, Math.ceil((GETREADY_MS - calib.timer) / 1000))
    renderCalibration(`Get ready: ${prompt}… ${remaining}`, calib.timer / GETREADY_MS)
    if (calib.timer >= GETREADY_MS) { calib.phase = 'capture'; calib.timer = 0 }
    return
  }

  // Capture phase — sample the held pose.
  const metric = EXERCISES[calib.id].metric(world as unknown as Landmarks)
  ;(calib.step === 0 ? calib.engage : calib.relax).add(metric)
  const remaining = Math.max(1, Math.ceil((CAPTURE_MS - calib.timer) / 1000))
  renderCalibration(`Hold it: ${prompt}… ${remaining}`, calib.timer / CAPTURE_MS)

  if (calib.timer < CAPTURE_MS) return

  if (calib.step === 0) {
    // Move on to the relaxed/rest pose.
    calib.step = 1
    calib.phase = 'ready'
    calib.timer = 0
    showCalibBanner(calib.id, 1)
    voice.play('say:' + calibPrompt(calib.id, 1))
    return
  }

  // Both poses captured — validate the range, then start (or retry).
  const relaxed = calib.relax.value()
  const engaged = calib.engage.value()
  if (!Number.isFinite(relaxed) || !Number.isFinite(engaged) || Math.abs(engaged - relaxed) < MIN_RANGE) {
    voice.play('say:I could not tell your two positions apart. Let\'s try again — make them clearly different.')
    calib = { id: calib.id, step: 0, phase: 'ready', relax: new RangeCalibrator(), engage: new RangeCalibrator(), timer: 0 }
    showCalibBanner(calib.id, 0)
    voice.play('say:' + calibPrompt(calib.id, 0))
    return
  }
  session = new GenericGameSession(calib.id, relaxed, engaged, performance.now())
  calib = null
  voice.play('calibrated')
  setCalibrating(false)
  startGameHud()
  appMode = 'live'
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
  voice.stop() // manual exit — silence any in-flight/queued coaching
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
  if (appMode === 'live') {
    voice.stop() // manual Finish — stop talking, but let finishSession proceed
    finishSession()
  } else {
    abandonToMenu()
  }
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

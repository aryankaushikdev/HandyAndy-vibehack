// Voice coaching. Two sources, in priority order:
//   1. Pre-generated ElevenLabs clips in /public/audio/<id>.mp3 (best quality),
//      played instantly on-device with the Web Audio API.
//   2. The browser's built-in speech engine (speechSynthesis) as a free fallback
//      when a clip isn't present — no key, no cost, works offline.
//
// So voice works out of the box via the browser; generate the ElevenLabs clips
// (scripts/generate-voice.mjs) any time you want the nicer voice — no code change.

export const CLIP_IDS = [
  'start', 'next_index', 'next_middle', 'next_ring', 'next_pinky', 'next_slide',
  'perfect', 'good', 'hold_longer',
  'wrong_index', 'wrong_middle', 'wrong_ring', 'wrong_pinky',
  'rep_done', 'complete',
  // new exercises + calibration
  'go_ip', 'go_mcp', 'go_abduction', 'go_pinky', 'ease_back',
  'relax_pose', 'reach_pose', 'calibrated',
] as const

// Spoken text per id — used by the browser-speech fallback. Keep in sync with
// the lines in scripts/generate-voice.mjs.
const TEXT: Record<string, string> = {
  start: "Let's begin. Show me your open palm.",
  next_index: 'Touch your index finger.',
  next_middle: 'Now your middle finger.',
  next_ring: 'Now your ring finger.',
  next_pinky: 'Now your little finger.',
  next_slide: 'Now slide your thumb down to the base.',
  perfect: 'Perfect!',
  good: 'Well done.',
  hold_longer: 'Almost. Next time, hold it steady a little longer.',
  wrong_index: "That's not the one. Touch your index finger.",
  wrong_middle: "That's not the one. Touch your middle finger.",
  wrong_ring: "That's not the one. Touch your ring finger.",
  wrong_pinky: "That's not the one. Touch your little finger.",
  rep_done: 'Great rep!',
  complete: 'Session complete. Great work.',
  // new exercises
  go_ip: "Bend your thumb tip, then straighten. Let's go.",
  go_mcp: "Bend your thumb knuckle, then straighten. Let's go.",
  go_abduction: 'Move your thumb out slowly, and back. Stay in control.',
  go_pinky: 'Reach your thumb across to your little-finger base, and hold.',
  ease_back: 'Ease back. Stay within your safe range.',
  // calibration
  relax_pose: 'Hold your hand relaxed.',
  reach_pose: 'Now reach as far as is comfortable, and hold.',
  calibrated: "Got it. Let's begin.",
}

const PREF_KEY = 'thumb-coach.voice'

class Voice {
  private ctx: AudioContext | null = null
  private buffers = new Map<string, AudioBuffer>()
  private queue: string[] = []
  private current: AudioBufferSourceNode | null = null
  private loaded = false
  private loading = false
  private ttsVoice: SpeechSynthesisVoice | null = null
  enabled: boolean

  constructor() {
    const saved = localStorage.getItem(PREF_KEY)
    this.enabled = saved === null ? true : saved === 'on'
    if ('speechSynthesis' in window) {
      const pick = () => { this.ttsVoice = this.pickVoice() }
      pick()
      window.speechSynthesis.onvoiceschanged = pick
    }
  }

  setEnabled(on: boolean) {
    this.enabled = on
    localStorage.setItem(PREF_KEY, on ? 'on' : 'off')
    if (on) this.unlock()
    else this.stopAll()
  }

  // Must run inside a user gesture (Start / toggle) so audio is allowed to play.
  async unlock() {
    if (!this.ctx) {
      const AC = window.AudioContext || (window as any).webkitAudioContext
      if (AC) this.ctx = new AC()
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      try { await this.ctx.resume() } catch { /* ignore */ }
    }
    // Warm up speechSynthesis within the gesture (needed on iOS).
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance('')
      u.volume = 0
      try { window.speechSynthesis.speak(u) } catch { /* ignore */ }
    }
    this.preload()
  }

  private pickVoice(): SpeechSynthesisVoice | null {
    const vs = window.speechSynthesis.getVoices()
    if (!vs.length) return null
    return (
      vs.find((v) => /en-GB/i.test(v.lang)) ||
      vs.find((v) => /^en/i.test(v.lang)) ||
      vs[0]
    )
  }

  private async preload() {
    if (this.loaded || this.loading || !this.ctx) return
    this.loading = true
    await Promise.all(
      CLIP_IDS.map(async (id) => {
        try {
          const res = await fetch(`/audio/${id}.mp3`)
          if (!res.ok) return
          this.buffers.set(id, await this.ctx!.decodeAudioData(await res.arrayBuffer()))
        } catch {
          /* missing clip → browser-speech fallback handles it */
        }
      }),
    )
    this.loading = false
    this.loaded = true
    if (this.buffers.size === 0) {
      console.info('[voice] using browser speech (no ElevenLabs clips found — run scripts/generate-voice.mjs for nicer audio)')
    }
  }

  play(id: string) {
    if (!this.enabled) return
    // Dynamic text (e.g. "say:Rep 3 of 10") is always spoken by the browser —
    // there's no pre-recorded clip for it.
    if (id.startsWith('say:')) { this.speakText(id.slice(4)); return }
    if (this.ctx && this.buffers.has(id)) {
      // Best quality: queued ElevenLabs clip.
      if (this.queue[this.queue.length - 1] === id) return
      this.queue.push(id)
      if (!this.current) this.pump()
    } else {
      this.speakText(TEXT[id]) // free browser-speech fallback
    }
  }

  private speakText(text?: string) {
    if (!text || !('speechSynthesis' in window)) return
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'en-GB'
    u.rate = 1.05
    if (this.ttsVoice) u.voice = this.ttsVoice
    window.speechSynthesis.speak(u) // speechSynthesis maintains its own queue
  }

  private pump() {
    if (!this.ctx || this.queue.length === 0) { this.current = null; return }
    const buf = this.buffers.get(this.queue.shift()!)
    if (!buf) { this.pump(); return }
    const src = this.ctx.createBufferSource()
    src.buffer = buf
    src.connect(this.ctx.destination)
    src.onended = () => { this.current = null; this.pump() }
    this.current = src
    src.start()
  }

  private stopAll() {
    this.queue = []
    try { this.current?.stop() } catch { /* already stopped */ }
    this.current = null
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()
  }
}

export const voice = new Voice()

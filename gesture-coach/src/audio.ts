// Voice coaching — improved for HandyAndy integration.
// Key improvements over original:
//   • Slower, more natural speech rate (0.82 vs original 1.05)
//   • Movement-responsive: 200ms deliberate delay so voice feels like a
//     confirmation of detected movement, not a pre-emptive instruction
//   • Debounced browser-speech: prevents rapid-fire stacking of utterances
//   • Priority system: corrections cancel pending praise; important cues
//     interrupt minor ones
//   • Prefers en-GB voice for NHS clinical tone

export const CLIP_IDS = [
  'start', 'next_index', 'next_middle', 'next_ring', 'next_pinky', 'next_slide',
  'perfect', 'good', 'hold_longer',
  'wrong_index', 'wrong_middle', 'wrong_ring', 'wrong_pinky',
  'rep_done', 'complete',
  'go_ip', 'go_mcp', 'go_abduction', 'go_pinky', 'ease_back',
  'relax_pose', 'reach_pose', 'calibrated',
] as const

const TEXT: Record<string, string> = {
  start:       "Let's begin. Show me your open palm.",
  next_index:  'Touch your index finger.',
  next_middle: 'Now your middle finger.',
  next_ring:   'Now your ring finger.',
  next_pinky:  'Now your little finger.',
  next_slide:  'Now slide your thumb down to the base.',
  perfect:     'Perfect!',
  good:        'Well done.',
  hold_longer: 'Almost there. Hold it a little longer next time.',
  wrong_index: 'Not quite — touch your index finger.',
  wrong_middle:'Not quite — touch your middle finger.',
  wrong_ring:  'Not quite — touch your ring finger.',
  wrong_pinky: 'Not quite — touch your little finger.',
  rep_done:    'Good rep. Keep going.',
  complete:    'Session complete. Excellent work today.',
  go_ip:       "Bend your thumb tip gently, then straighten. Let's go.",
  go_mcp:      "Bend your thumb knuckle, then straighten. Take your time.",
  go_abduction:'Move your thumb out slowly and bring it back. Stay in control.',
  go_pinky:    'Reach your thumb across to your little-finger base and hold.',
  ease_back:   'Ease back. Stay within your comfortable range.',
  relax_pose:  'Hold your hand in a relaxed position.',
  reach_pose:  'Now reach as far as is comfortable and hold.',
  calibrated:  "Got it. We're ready to begin.",
}

// Priority levels — higher = more important, will cancel lower-priority speech
const PRIORITY: Record<string, number> = {
  ease_back:   10, // safety — always speak
  complete:     9,
  wrong_index:  8, wrong_middle: 8, wrong_ring: 8, wrong_pinky: 8, // corrections
  start:        7, go_ip: 7, go_mcp: 7, go_abduction: 7, go_pinky: 7,
  relax_pose:   7, reach_pose: 7, calibrated: 7,
  rep_done:     6,
  next_index:   5, next_middle: 5, next_ring: 5, next_pinky: 5, next_slide: 5,
  hold_longer:  4,
  perfect:      3, good: 3,
}

// Movement-response delay (ms) — voice fires AFTER movement is confirmed,
// making it feel like a response to what the patient did, not a pre-emptive cue
const MOVEMENT_RESPONSE_DELAY_MS = 180

// Minimum gap between browser-speech utterances (ms) — prevents stacking
const MIN_GAP_MS = 500

const PREF_KEY = 'handyandy.voice'

class Voice {
  private ctx: AudioContext | null = null
  private buffers = new Map<string, AudioBuffer>()
  private queue: string[] = []
  private current: AudioBufferSourceNode | null = null
  private loaded = false
  private loading = false
  private ttsVoice: SpeechSynthesisVoice | null = null
  private lastSpokenAt = 0
  private pendingTimer: ReturnType<typeof setTimeout> | null = null
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

  async unlock() {
    if (this.ctx) return
    this.ctx = new AudioContext()
    if (this.ctx.state === 'suspended') await this.ctx.resume()
    this.preload()
  }

  private pickVoice(): SpeechSynthesisVoice | null {
    const vs = window.speechSynthesis.getVoices()
    if (!vs.length) return null
    // Prefer a natural British English voice
    return (
      vs.find((v) => /en-GB/i.test(v.lang) && !/espeak/i.test(v.name)) ||
      vs.find((v) => /en-GB/i.test(v.lang)) ||
      vs.find((v) => /^en/i.test(v.lang) && !/espeak/i.test(v.name)) ||
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
        } catch { /* missing clip — browser-speech fallback handles it */ }
      }),
    )
    this.loading = false
    this.loaded = true
  }

  play(id: string) {
    if (!this.enabled) return
    if (id.startsWith('say:')) { this.scheduleText(id.slice(4), PRIORITY['rep_done'] ?? 5); return }

    const priority = PRIORITY[id] ?? 5

    // Safety cues fire immediately without delay
    if (priority >= 8) {
      this.cancelPending()
      this.executeCue(id)
      return
    }

    // For movement-response cues: delay so the voice feels like feedback
    // rather than an instruction. Cancel a weaker pending cue if one exists.
    if (this.pendingTimer !== null) {
      // Only cancel the pending cue if the new one is higher priority
      const pendingPriority = (this as any)._pendingPriority ?? 0
      if (priority >= pendingPriority) this.cancelPending()
      else return // keep higher-priority pending cue
    }

    ;(this as any)._pendingPriority = priority
    this.pendingTimer = setTimeout(() => {
      this.pendingTimer = null
      ;(this as any)._pendingPriority = 0
      this.executeCue(id)
    }, MOVEMENT_RESPONSE_DELAY_MS)
  }

  private cancelPending() {
    if (this.pendingTimer !== null) {
      clearTimeout(this.pendingTimer)
      this.pendingTimer = null
      ;(this as any)._pendingPriority = 0
    }
  }

  private executeCue(id: string) {
    if (this.ctx && this.buffers.has(id)) {
      if (this.queue[this.queue.length - 1] === id) return
      this.queue.push(id)
      if (!this.current) this.pump()
    } else {
      this.scheduleText(TEXT[id], PRIORITY[id] ?? 5)
    }
  }

  private scheduleText(text?: string, priority = 5) {
    if (!text || !('speechSynthesis' in window)) return
    const now = Date.now()
    // For lower-priority cues, respect the minimum gap between utterances
    const gap = priority >= 8 ? 0 : MIN_GAP_MS
    if (now - this.lastSpokenAt < gap) return
    this.speakText(text)
  }

  private speakText(text?: string) {
    if (!text || !('speechSynthesis' in window)) return
    // Cancel any queued browser speech so we don't stack utterances
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang  = 'en-GB'
    u.rate  = 0.82   // ← Slower, more deliberate clinical pace
    u.pitch = 1.0
    u.volume = 1.0
    if (this.ttsVoice) u.voice = this.ttsVoice
    u.onstart = () => { this.lastSpokenAt = Date.now() }
    window.speechSynthesis.speak(u)
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
    this.cancelPending()
    this.queue = []
    try { this.current?.stop() } catch { /* already stopped */ }
    this.current = null
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()
  }
}

export const voice = new Voice()

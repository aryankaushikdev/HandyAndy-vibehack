// Generate the voice-coaching clips with ElevenLabs — run once.
//
//   ELEVENLABS_API_KEY=sk_... node scripts/generate-voice.mjs
//
// Optional overrides:
//   ELEVENLABS_VOICE_ID=<voice id>     (default: Rachel)
//   ELEVENLABS_MODEL_ID=<model id>     (default: eleven_multilingual_v2)
//
// Writes MP3s into public/audio/. The app plays them on-device; re-run any time
// you change the lines below or want a different voice.

import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const API_KEY = process.env.ELEVENLABS_API_KEY
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM' // Rachel
const MODEL_ID = process.env.ELEVENLABS_MODEL_ID || 'eleven_multilingual_v2'

if (!API_KEY) {
  console.error('Set ELEVENLABS_API_KEY first:\n  ELEVENLABS_API_KEY=sk_... node scripts/generate-voice.mjs')
  process.exit(1)
}

// id → spoken text. ids must match CLIP_IDS in src/audio.ts.
const LINES = {
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
  go_ip: "Bend your thumb tip, then straighten. Let's go.",
  go_mcp: "Bend your thumb knuckle, then straighten. Let's go.",
  go_abduction: 'Move your thumb out slowly, and back. Stay in control.',
  go_pinky: 'Reach your thumb across to your little-finger base, and hold.',
  ease_back: 'Ease back. Stay within your safe range.',
  relax_pose: 'Hold your hand relaxed.',
  reach_pose: 'Now reach as far as is comfortable, and hold.',
  calibrated: "Got it. Let's begin.",
}

const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'audio')
await mkdir(outDir, { recursive: true })

async function synth(id, text) {
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`,
    {
      method: 'POST',
      headers: { 'xi-api-key': API_KEY, 'content-type': 'application/json' },
      body: JSON.stringify({
        text,
        model_id: MODEL_ID,
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
      }),
    },
  )
  if (!res.ok) throw new Error(`${id}: ${res.status} ${await res.text()}`)
  const buf = Buffer.from(await res.arrayBuffer())
  await writeFile(join(outDir, `${id}.mp3`), buf)
  console.log(`✓ ${id}.mp3  (${(buf.length / 1024).toFixed(0)} KB)  "${text}"`)
}

console.log(`Generating ${Object.keys(LINES).length} clips → ${outDir}`)
for (const [id, text] of Object.entries(LINES)) {
  await synth(id, text) // sequential to stay well under rate limits
}
console.log('Done. Reload the app — voice is on by default.')

# Thumb Coach

A phone web app that watches you do your prescribed **thumb-opposition (Kapandji)
rehab exercise** and gives live form feedback + tracks your progress over time.

It runs Google's MediaPipe hand-tracking **on your phone, in the browser** — the
camera feed never leaves your device. Session history is stored locally on the
phone. Optional AI coaching can be switched on later (see below).

---

## The exercise it coaches

From your physio sheet: hand open, **palm facing the camera so it can see all
your fingers**. Touch your thumb tip to your index, then middle, then ring, then
little fingertip in turn — holding each for 3–5 seconds with the joints **slightly
rounded** (not clenched, not straight) — then slide the thumb down the little
finger to its base. That whole cycle is **one rep**; do 10 per session (the app
shows `Rep X of 10` with I/M/R/L/S step markers so you can see your progress).

What the app measures each rotation:

- **Reach** — how close the thumb got to each fingertip (normalised to your hand size)
- **Hold** — whether you held each contact the full ~5 seconds
- **Joint shape** — thumb IP + finger PIP angles, flagging clenched or locked-straight
- **Compensation** — whether your forearm drifted, or the finger curled in to a lazy thumb
- **The slide** — thumb tip reaching the base of the little finger

It scores each rotation 0–100, saves the session, and shows your trend.

## Exercises

Pick from a menu of five skier's-thumb exercises (all unlocked; levels are just
difficulty labels):

| Level | Exercise | What it is |
|---|---|---|
| 1 | Thumb to fingertip | The opposition sequence (thumb to each fingertip + slide) — the original game. |
| 1 | Thumb tip bend | Bend just the thumb tip joint, then straighten. |
| 2 | Thumb knuckle bend | Bend the thumb knuckle (the injured MCP joint). |
| 3 | Thumb out (controlled) | Abduction — out and back, **capped for safety**; rewards control, not maximum spread. |
| 4 | Thumb to pinky base | Reach the thumb across the palm to the little-finger base, 6-second hold. |

The four new exercises measure **your own range of motion**, so each starts with a
quick 2-pose calibration (hold relaxed, then reach as far as is comfortable). This
runs every session. The detection lives in
[`src/exerciseModule.ts`](src/exerciseModule.ts); the game wrapper that scores reps,
keeps streaks/combos and speaks coaching is
[`src/genericSession.ts`](src/genericSession.ts).

Every exercise shares the same game, voice, levels, daily goal and progress history.

## The game

Every fingertip touch is a **movement**, rated **0–10** the instant you release:
reached it (4) + held the full ~5s (3) + joints rounded (2) + no compensation (1).
The slide counts too (10 if you reach the base).

- The rating **flashes on screen** after each movement (`9/10 Great`, `10/10 Perfect! 🔥`).
- A movement scoring 8+ keeps your **streak** alive; a sloppy one resets it.
- **Combos**: a live streak multiplies your points — ×1.5 at a streak of 3, ×2 at 5,
  ×2.5 at 8, ×3 at 12. A `×2 COMBO` badge shows on screen; the flash shows the bonus
  (`+18 (×2)`). Points earned = rating × multiplier.
- **Levels**: your all-time points are XP. You level up on a rising curve
  (Level 2 at 100, 3 at 250, 4 at 450, …) with a progress bar to the next level.
- **Daily goal**: complete a target number of rotations per day (default 16 ≈ your
  physio's 2–3 sessions × 8–12). A **day streak** counts consecutive days you hit the
  goal — shown as `🗓️ 3-day` on the home strip.
- The end-of-session scoreboard shows points, perfect-10 count, and best streak (with
  a 🏆 for a new record), plus your level progress and daily-goal status.

All the knobs — streak threshold, combo tiers, daily goal — live in `src/config.ts`.

---

## Honest limitations (read this)

- A single phone camera estimates depth — it does **not** measure clinical joint
  angles. Treat every number as **your-own-baseline trend**, not a medical degree.
- Progress comparisons are only reliable if you **film from a similar angle each
  time**. Prop the phone the same way, same distance, every session.
- This is **not a medical device** and does not replace your therapist. It coaches
  form and effort against the routine you were already given.

---

## Run it on your laptop (development)

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. The camera works on `localhost` over plain HTTP —
browsers treat localhost as a secure context, so no certificate is needed.

## Run it on your phone (the real use case)

The browser camera API needs **real HTTPS** on anything that isn't localhost, so
the dev server (plain HTTP) won't drive the camera from your phone over Wi-Fi.
Deploy it — that's the proper path and it's quick:

**Deploy to Vercel (recommended — proper HTTPS, always available).**

```bash
npm install -g vercel   # if you don't have it
vercel                  # follow prompts; it autodetects Vite
```

Open the deployment URL on your phone and "Add to Home Screen".

---

## Tuning it to your hand

After your first session, look at the **touch sensor** bar at the bottom of the
live screen while you pinch — it shows how close your thumb is, with a green tick
at the "counts as a touch" line. If touches register too early or never register,
adjust the thresholds in [`src/config.ts`](src/config.ts) — every number (contact
distance, hold seconds, what counts as "rounded", drift tolerance) is documented
and lives in that one file.

---

## Optional: AI coaching summaries

By default, the end-of-session summary is generated locally (free, offline) by
[`src/summary.ts`](src/summary.ts). To get richer natural-language coaching from
Claude instead:

1. Deploy to Vercel (option B above).
2. In the Vercel project settings, add an environment variable
   `ANTHROPIC_API_KEY` with your key from console.anthropic.com.
3. Redeploy.

The app will then call [`api/coach.ts`](api/coach.ts) for the summary and fall
back to the local one if anything goes wrong. No code change needed.
(Optional: set `THUMB_COACH_MODEL` to override the model; defaults to `claude-opus-4-8`.)

---

## Voice coaching (ElevenLabs)

The app speaks to you while you exercise — it announces the next finger, praises a
good hold (`Well done` / `Perfect!`), tells you off by name if you touch the wrong
finger (`That's not the one — touch your index finger`), and calls the end of each
rep and the session. There's a **🔊 Voice** toggle on the live screen (on by default,
remembered per device).

Two voice sources, in priority order:

1. **Browser speech** (`speechSynthesis`) — the default. Free, no key, works out of
   the box. The voice is robotic but reacts instantly.
2. **ElevenLabs clips** — pre-generated MP3s in `public/audio/`. Nicer voice. If
   present they're used automatically in place of browser speech; if absent the app
   falls back to (1). They're pre-generated (not synthesised live) so cues fire the
   instant you slip, with no network latency or per-rep cost.

**For the nicer ElevenLabs voice**, generate the clips once with your API key
(needs a paid plan — ElevenLabs blocks free-tier API use from VPNs/proxies):

```bash
ELEVENLABS_API_KEY=sk_... node scripts/generate-voice.mjs
```

That writes 15 MP3s into `public/audio/`. Options:

```bash
ELEVENLABS_VOICE_ID=<voice id>    # default: Rachel (21m00Tcm4TlvDq8ikWAM)
ELEVENLABS_MODEL_ID=<model id>    # default: eleven_multilingual_v2
```

Edit the spoken lines (or add a different voice) at the top of
[`scripts/generate-voice.mjs`](scripts/generate-voice.mjs) and re-run. The clip ids
must stay in sync with `CLIP_IDS` in [`src/audio.ts`](src/audio.ts).

## Design

The UI follows the **GOV.UK Design System** visual language: the GDS colour palette,
type scale, button styles, the yellow keyboard-focus state, a service header, and an
Alpha phase banner. The actual *GDS Transport* font is licensed for gov.uk services
only, so the stack falls back to Arial exactly as the Design System specifies for
non-government use. (This is a personal tool styled in the GDS idiom — it is not, and
does not claim to be, a government service.)

## How it's built

| File | Role |
|---|---|
| `src/main.ts` | Camera + MediaPipe setup, render loop, overlay drawing, buttons |
| `src/exercise.ts` | The opposition state machine — turns landmarks into live cues + a scored session |
| `src/landmarks.ts` | Geometry helpers (distances, joint angles, hand-size normalisation) |
| `src/config.ts` | **All tunable thresholds** |
| `src/storage.ts` | On-device session history (localStorage) |
| `src/summary.ts` | Local rule-based post-session coaching |
| `src/ui.ts` | DOM rendering |
| `src/exerciseModule.ts` | Calibrated detectors for the 4 skier's-thumb exercises |
| `src/genericSession.ts` | Game wrapper (points/streak/combo/voice) for those 4 |
| `src/audio.ts` | Voice-clip player (Web Audio, on-device) |
| `scripts/generate-voice.mjs` | One-off ElevenLabs clip generator |
| `api/coach.ts` | Optional Claude coaching endpoint (Vercel function) |

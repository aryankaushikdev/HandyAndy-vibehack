# HandyAndy

**Turn a doctor's note into a personalised hand-rehab plan you can actually see and practise — with a 3D guide and a live camera coach.**

HandyAndy takes a clinician's free-text description of a hand/finger injury, works out what to exercise, shows the movement on an interactive 3D hand, and then watches you do it through your phone camera and gives live feedback — all while flagging symptoms that need real clinical attention.

---

## The problem

Hand and finger rehabilitation lives or dies on what the patient does **at home, between appointments**. In practice that hand-off is broken:

- **Instructions get lost in translation.** A clinician scribbles "R index PIP stiff, gentle flexion/extension, hold 5s" on a sheet. At home the patient half-remembers it, isn't sure *which* joint, and guesses the movement.
- **Paper exercise sheets are static.** A photo of a hand can't show the actual range, the hold, or whether *your* hand is doing it right.
- **There's no feedback loop.** The patient can't tell if their form is correct, if they're compensating, or whether they're improving — and the clinician has no view of what happened between visits.
- **Safety gets missed.** Numbness, a cold or discoloured finger, spreading swelling or signs of infection are red flags that should stop exercise and trigger a call — but a paper sheet never says "stop and ring 111."

The result is poor adherence, slower recovery, and avoidable complications.

## The solution

HandyAndy closes that loop with **three connected features** that take the patient from a clinician's note all the way to a guided, supervised home session.

```
  Doctor's description  ──►  3D exercise guide  ──►  Real-time camera coach
  (understand the plan)      (see the movement)      (practise with feedback)
```

---

### 1. Doctor's description → a personalised plan

The clinician (or patient) pastes the treatment note into the dashboard and presses **Analyse & Preview 3D Model**. HandyAndy then:

1. **Runs a safety scan first.** The note is checked for red-flag terms (numbness, blue/cold/black finger, no sensation, severe pain, deformity, infection, pus, fever…). If any are present, analysis is **blocked** and the app shows a "seek clinical advice — contact your clinician or call 111" alert instead of suggesting exercises.
2. **Extracts a structured plan** from the free text — affected side, finger, joint (MCP / PIP / DIP), pain level, the movement problem, and a recommended, clinician-approved exercise. This is a deterministic, on-device extractor, so the demo works with no API key and never invents a diagnosis or a new exercise.
3. **Surfaces the result** in an "AI Mobility Analysis" card (e.g. *"Right index finger — PIP · Hook fist"*) and uses it to drive the 3D view.

> HandyAndy only ever **extracts and structures** what the clinician wrote and maps it to an approved movement. It does not diagnose, and every result is marked as needing clinician confirmation.

### 2. 3D exercise guide

The extracted plan drives an interactive **3D hand model** (the Blender-exported `hand gesture.glb`, rendered with Three.js):

- The viewer highlights the affected joint and **animates the prescribed movement** (e.g. the index-to-thumb pinch) on a smooth loop, so the patient can see exactly what "gentle flexion, hold, release" looks like.
- The model can be rotated / paused, giving a clear view from any angle — something a paper photo can never do.

This replaces "guess what the sheet meant" with "watch the exact movement on a real hand."

### 3. Real-time exercise coach

From the dashboard the patient taps **Launch Live Exercise Coach** to open the camera-based coach (the "Thumb Coach"), powered by Google **MediaPipe** hand-tracking running **entirely in the browser**:

- **The camera feed never leaves the device** — hand tracking is on-device, and session history is stored locally on the phone.
- It watches the patient perform the prescribed movement and gives **live form feedback**: reach (how close the thumb gets to each fingertip, normalised to hand size), hold time, joint shape (flagging clenched or locked-straight), and compensation (forearm drift / curling the finger in).
- It counts reps, **scores each one 0–100**, tracks streaks, and saves a session trend.
- **Voice coaching** speaks the cues out loud so the patient can keep their eyes on their hand (browser speech by default; optional higher-quality ElevenLabs voice — see below).

This is the missing feedback loop: the patient finds out *in the moment* whether they're doing it right.

---

## How it fits together

The Next.js app in [`frontend/`](frontend/) is the single HandyAndy product. The live coach is built as a self-contained app and **served from inside it** at `/coach`, so the whole thing runs as one site:

```
Patient opens HandyAndy (frontend, Next.js)
   │
   ├─ Landing page ............... what it is + a phone showing the exercise plan
   └─ Dashboard
        ├─ Clinical Notes  ──► safety scan + plan extraction      [Feature 1]
        ├─ 3D Recovery Viewer ──► animated hand model              [Feature 2]
        └─ "Launch Live Exercise Coach" ──► /coach (MediaPipe)     [Feature 3]
```

---

## Repository structure

```
HandyAndy-vibehack/
├─ frontend/                     # The HandyAndy app (Next.js 15, React 19, TypeScript)
│  ├─ app/                       #   landing page (/) + dashboard (/dashboard)
│  ├─ components/                #   DashboardClient, HandViewer (3D), HeroScene…
│  ├─ lib/analyze.ts             #   safety scan + deterministic note → plan extractor
│  └─ public/
│     ├─ models/hand.glb         #   3D hand model used by the viewer
│     └─ coach/                  #   built Live Exercise Coach, served at /coach
├─ gesture ship preview/         # "Thumb Coach" — the live camera coach (Vite + MediaPipe)
│  ├─ src/                       #   hand tracking, scoring, voice (audio.ts)
│  └─ scripts/generate-voice.mjs #   optional: generate ElevenLabs voice clips
├─ blender/hand gesture.glb      # source 3D hand model
└─ src/                          # earlier TanStack Start prototype (superseded by frontend/)
```

## Tech stack

- **App:** Next.js 15, React 19, TypeScript
- **3D:** Three.js (`GLTFLoader`) + a Blender-exported `.glb`
- **Hand tracking:** Google MediaPipe Tasks Vision (`HandLandmarker`), in-browser
- **Voice:** browser `speechSynthesis`, with optional ElevenLabs pre-generated clips
- **Coach build:** Vite (vanilla TypeScript)

---

## Getting started

**Prerequisites:** Node.js 20+ (developed on 24) and npm.

### Run the app

```bash
cd frontend
npm install
npm run dev
```

Then open:

- **http://localhost:3000** — landing page
- **http://localhost:3000/dashboard** — the clinician/patient dashboard (features 1 & 2)
- **http://localhost:3000/coach/index.html** — the Live Exercise Coach (feature 3), also reachable via the dashboard button

> **Camera note:** the live coach uses `getUserMedia`, which browsers only allow on **`localhost`** or over **HTTPS**. It works on your laptop at `localhost`; testing on a phone or a LAN IP needs real HTTPS (e.g. a tunnel or a deploy). The camera only starts **after you pick an exercise**, and the coach shows a clear on-screen reason if permission is blocked.

### Rebuilding the Live Exercise Coach

The coach is a separate Vite app whose build is committed into `frontend/public/coach`. If you change anything under `gesture ship preview/src`, rebuild and redeploy it:

```bash
cd "gesture ship preview"
npm install
npx vite build --base=/coach/
rm -rf ../frontend/public/coach && cp -R dist ../frontend/public/coach
```

(The `--base=/coach/` is required so the built asset paths resolve under `/coach`.)

### Optional: high-quality ElevenLabs voice

By default the coach speaks with the browser's built-in voice (a single voice, no setup). To use ElevenLabs clips instead:

```bash
cd "gesture ship preview"
echo 'ELEVENLABS_API_KEY=sk_your_key_here' > .env     # gitignored
node scripts/generate-voice.mjs                        # writes public/audio/*.mp3
```

The generator uses a free-tier-compatible voice and a low-cost model, and skips clips that already exist. After generating, rebuild/redeploy the coach (above) and set `useClips` to `true` in `gesture ship preview/src/audio.ts` to play the clips.

---

## Safety & disclaimer

HandyAndy is a **clinician-led rehabilitation aid, not a medical device and not a diagnosis.** It only structures a clinician's plan and helps a patient practise approved movements. It blocks exercise guidance when a note contains red-flag symptoms and tells the user to seek help. Always follow your clinician's advice. If you experience sudden or severe pain, numbness, or a cold/discoloured finger, stop and contact your clinician or call **111** (or **999** in an emergency).
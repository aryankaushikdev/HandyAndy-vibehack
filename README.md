# MoveMend — NHS Digital Rehabilitation Platform

A hackathon demo showcasing how AI, 3D visualisation, and real-time hand-tracking
can improve NHS patient rehabilitation outcomes.

## Project structure

```
movemend-next/      ← Main Next.js dashboard (this folder)
gesture-coach/      ← Companion Vite app (MediaPipe Thumb Coach)
public/models/      ← hand-gesture.glb (Blender 3D model)
```

## Quick start

**Terminal 1 — MoveMend dashboard:**
```bash
cd movemend-next
npm install
cp .env.local.example .env.local
# Add your Gemini API key (free from aistudio.google.com/apikey)
npm run dev
# → http://localhost:3000
```

**Terminal 2 — Gesture Coach (for Live Review page):**
```bash
cd gesture-coach
npm install
npm run dev
# → http://localhost:5174
```

Visit `http://localhost:3000` — the Gesture Coach will appear embedded in the
Live Reviews page.

## Features

### 🧠 AI Clinical Notes (Gemini 2.5 Flash-Lite)
- Write clinical observations → AI streams structured analysis
- Extracts specific exercise recommendation from HandyAndy exercise library
- Safety red-flag detection: 18 clinical warning terms block AI and show emergency callout
- Highlights recommended exercise in the checklist automatically

### 🖐️ 3D Recovery Viewer (Three.js + Blender GLB)
- Loads `hand-gesture.glb` — an actual hand animation from Blender
- Bounce-loop animation with play/pause and scrubber controls
- NHS-styled dark background with anatomical grid overlay
- Falls back to SVG placeholder if model fails to load

### 📷 Gesture Coach (MediaPipe on-device)
- Real-time thumb exercise coaching via phone camera
- 5 exercises: Kapandji opposition, IP flexion, MCP flexion, abduction, pinky reach
- Scored 0–10 on reach, hold time, joint shape, compensation
- Game mechanics: streaks, combos, levels, daily goals
- Camera never leaves device — WebAssembly processing only
- Embedded in MoveMend Live Review page via iframe

### 📊 Recovery Dashboard (NHS GDS)
- Live progress strip (updates as exercises are ticked)
- 7-day pain sparkline with trend indicator
- Pain logger with GDS 44px thumb slider
- Mobility analysis panel
- Clinician message card

## NHS GDS compliance
All interactive elements meet WCAG 2.2 AA:
- 3px yellow focus ring on all focusable elements
- 44×44px minimum touch targets (checkboxes, slider thumb)
- Colour contrast ≥ 4.5:1 throughout
- Skip-to-content link
- ARIA roles and live regions on all dynamic content
- Atkinson Hyperlegible Next typeface (low-vision optimised)

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | Yes | Gemini API key from aistudio.google.com |
| `NEXT_PUBLIC_GESTURE_COACH_URL` | No | Gesture Coach URL (default: http://localhost:5174) |

## Deploy to Vercel

1. Push to GitHub
2. Import to Vercel
3. Add `GEMINI_API_KEY` in project settings
4. Deploy `gesture-coach/` as a separate Vercel project
5. Set `NEXT_PUBLIC_GESTURE_COACH_URL` to the gesture-coach deployment URL

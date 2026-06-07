# MoveMend Gesture Coach

A companion web app that uses your phone/laptop camera and Google MediaPipe to give
**live form feedback** while you do your prescribed hand rehab exercises.

## How it fits into MoveMend

The **Join Live Review Session** button on the MoveMend dashboard links here.
A patient opens this app on their phone during their recovery session — the clinician
can observe progress data in the MoveMend dashboard at the same time.

## Run locally (development)

```bash
cd gesture-coach
npm install
npm run dev
# → http://localhost:5174
```

Keep the MoveMend dashboard running on port 3000 at the same time.

## Deploy to Vercel (for phone use)

The MediaPipe camera API requires real HTTPS on anything that isn't localhost.
Deploy to Vercel for phone access:

```bash
npm install -g vercel
cd gesture-coach
vercel
```

Then in your MoveMend `.env.local`, set:
```
NEXT_PUBLIC_GESTURE_COACH_URL=https://your-gesture-coach.vercel.app
```

## Exercises available

| Level | Exercise | Clinical purpose |
|---|---|---|
| 1 | Thumb to fingertip (Kapandji) | Thumb opposition — the primary recovery metric |
| 1 | Thumb tip bend | Distal IP joint flexion / extension |
| 2 | Thumb knuckle bend | MCP joint (the injured joint in skier's thumb) |
| 3 | Thumb out (controlled) | Abduction — capped for safety |
| 4 | Thumb to pinky base | Full opposition reach + hold |

## Privacy

Camera footage **never leaves the device**. All processing happens locally via
WebAssembly. Session history is stored in browser localStorage only.

## Optional AI coaching

Set `ANTHROPIC_API_KEY` in your Vercel environment variables to enable
post-session coaching summaries powered by Claude.

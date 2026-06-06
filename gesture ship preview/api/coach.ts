// OPTIONAL post-session coaching via Claude. The app works fully without this —
// main.ts calls /api/coach, and if it's not configured (no API key, or running the
// static build with no serverless runtime) it silently falls back to the local
// rule-based summary in src/summary.ts.
//
// To switch it on when deployed to Vercel:
//   1. Add an env var ANTHROPIC_API_KEY (your key from console.anthropic.com)
//   2. Redeploy. That's it — no code change.
//
// Raw fetch is used deliberately so the core app needs zero extra dependencies.

export const config = { runtime: 'nodejs' }

// Vercel passes standard (req, res). We read the JSON digest, ask Claude for
// short coaching lines, and return { lines: string[] }.
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'POST only' })
    return
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    // Not configured — tell the client so it uses the local summary.
    res.status(501).json({ error: 'coach not configured' })
    return
  }

  const digest = req.body ?? {}
  const model = process.env.THUMB_COACH_MODEL || 'claude-opus-4-8'

  const system =
    'You are an encouraging hand-therapy assistant helping someone with a prescribed ' +
    'thumb-opposition (Kapandji) rehab exercise: thumb tip to each fingertip in turn ' +
    '(index→middle→ring→little), holding ~3s, joints slightly rounded, then sliding the ' +
    'thumb down the little finger. You are given quantitative session data measured from ' +
    'a phone camera (distances are normalised to hand size; lower = closer reach; touchRate ' +
    'is the fraction of rotations the thumb reached that finger). Give 3–5 short, concrete, ' +
    'kind coaching lines: praise what improved vs history, name the weakest finger, and one ' +
    'specific thing to focus on next session. Never give medical diagnosis or change their ' +
    'prescription — only form and effort feedback. Return STRICT JSON: {"lines": string[]}.'

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: 1024,
        system,
        messages: [
          { role: 'user', content: `Session data:\n${JSON.stringify(digest, null, 2)}` },
        ],
        output_config: {
          format: {
            type: 'json_schema',
            schema: {
              type: 'object',
              properties: {
                lines: { type: 'array', items: { type: 'string' } },
              },
              required: ['lines'],
              additionalProperties: false,
            },
          },
        },
      }),
    })

    if (!r.ok) {
      res.status(502).json({ error: `claude ${r.status}` })
      return
    }

    const data = await r.json()
    const text = (data.content || []).find((b: any) => b.type === 'text')?.text || '{}'
    const parsed = JSON.parse(text)
    res.status(200).json({ lines: parsed.lines || [] })
  } catch (e: any) {
    res.status(500).json({ error: String(e?.message || e) })
  }
}

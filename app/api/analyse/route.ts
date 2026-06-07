import { GoogleGenerativeAI } from '@google/generative-ai'
import { AI_CLINICAL_SYSTEM_PROMPT } from '@/lib/constants'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

async function generateWithRetry(prompt: string, retries = 2): Promise<AsyncIterable<any>> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash-lite',
    systemInstruction: AI_CLINICAL_SYSTEM_PROMPT,
  })

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const result = await model.generateContentStream({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 700 },
      })
      return result.stream
    } catch (err: any) {
      const is429 =
        err?.status === 429 ||
        err?.message?.includes('429') ||
        err?.message?.includes('Too Many Requests')
      if (is429 && attempt < retries) {
        await sleep((attempt + 1) * 15000)
        continue
      }
      throw err
    }
  }
  throw new Error('Max retries exceeded')
}

export async function POST(req: Request) {
  try {
    const body = await req.json() as { notes?: unknown }
    const notes = body.notes

    if (!notes || typeof notes !== 'string') {
      return Response.json({ error: 'Invalid request.' }, { status: 400 })
    }

    const trimmed = notes.trim()

    if (trimmed.length < 10) {
      return Response.json(
        { error: 'Please enter at least a brief observation before analysing.' },
        { status: 400 }
      )
    }

    if (trimmed.length > 2000) {
      return Response.json(
        { error: 'Notes are too long. Please keep under 2,000 characters.' },
        { status: 400 }
      )
    }

    const stream = await generateWithRetry(`Patient clinical note: "${trimmed}"`)

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.text()
            if (text) controller.enqueue(new TextEncoder().encode(text))
          }
          controller.close()
        } catch (err) {
          controller.error(err)
        }
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-store',
      },
    })
  } catch (err: any) {
    console.error('[/api/analyse] Error:', err)
    const is429 =
      err?.status === 429 ||
      err?.message?.includes('429') ||
      err?.message?.includes('Too Many Requests')
    return Response.json(
      {
        error: is429
          ? 'Too many requests — please wait 30 seconds and try again.'
          : 'AI analysis is temporarily unavailable. Please save your notes and your clinician will review them.',
      },
      { status: is429 ? 429 : 500 }
    )
  }
}

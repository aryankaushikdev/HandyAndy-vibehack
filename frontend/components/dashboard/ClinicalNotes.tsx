'use client'

import { useState, useRef, type ReactNode } from 'react'

interface ClinicalNotesProps {
  patientName?: string
}

type AIStatus = 'idle' | 'loading' | 'success' | 'error'

// Convert AI markdown text into React nodes (bold, bullets, paragraphs)
function renderMarkdown(text: string): ReactNode[] {
  return text.split('\n').map((line, i) => {
    if (!line.trim()) return <br key={i} />

    // Replace **bold** with <strong>
    const parts = line.split(/\*\*(.*?)\*\*/g)
    const withBold = parts.map((part, j) =>
      j % 2 === 1 ? <strong key={j}>{part}</strong> : part
    )

    // Bullet lines
    const isBullet = /^[\s]*[-•]/.test(line)
    if (isBullet) {
      const content = line.replace(/^[\s\-•]+/, '')
      const contentParts = content.split(/\*\*(.*?)\*\*/g).map((part, j) =>
        j % 2 === 1 ? <strong key={j}>{part}</strong> : part
      )
      return (
        <li key={i} className="ml-5 list-disc text-[15px] leading-[22px] mb-1">
          {contentParts}
        </li>
      )
    }

    return (
      <p key={i} className="text-[15px] leading-[22px] mb-2">
        {withBold}
      </p>
    )
  })
}

export default function ClinicalNotes({ patientName }: ClinicalNotesProps) {
  const [notes,      setNotes]      = useState('')
  const [aiText,     setAiText]     = useState('')
  const [aiStatus,   setAiStatus]   = useState<AIStatus>('idle')
  const [saved,      setSaved]      = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  // ── Save ────────────────────────────────────────────────────────────────────
  const handleSave = () => {
    // Production: POST /api/notes with patient session ID
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  // ── AI Analysis (streaming) ──────────────────────────────────────────────────
  const handleAnalyse = async () => {
    if (!notes.trim() || notes.trim().length < 10) {
      alert('Please enter at least a brief observation before analysing.')
      return
    }

    abortRef.current?.abort()
    abortRef.current = new AbortController()

    setAiStatus('loading')
    setAiText('')

    try {
      const response = await fetch('/api/analyse', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ notes }),
        signal:  abortRef.current.signal,
      })

      if (!response.ok) {
        const err = await response.json() as { error?: string }
        throw new Error(err.error ?? 'AI analysis failed')
      }

      if (!response.body) throw new Error('No stream body')

      const reader  = response.body.getReader()
      const decoder = new TextDecoder()
      setAiStatus('success')

      // Stream tokens into state — this produces the live typing effect
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        setAiText((prev) => prev + decoder.decode(value, { stream: true }))
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return
      setAiStatus('error')
      setAiText(
        'AI analysis is temporarily unavailable. Please save your notes and ' +
        'your clinician will review them at your next session.'
      )
    }
  }

  const showResult = (aiStatus === 'success' || aiStatus === 'error') && aiText.length > 0

  return (
    <section
      className="border-t-4 border-nhs-blue pt-4"
      aria-labelledby="clinical-notes-heading"
    >
      <h2
        id="clinical-notes-heading"
        className="font-bold text-[24px] leading-[32px] mb-3"
      >
        Clinical Notes
      </h2>
      <label
        className="block text-[19px] leading-[28px] mb-2"
        htmlFor="clinical-notes"
      >
        Record your daily observations or symptoms for your physiotherapist.
      </label>

      <textarea
        id="clinical-notes"
        className="gds-textarea"
        style={{ minHeight: '130px' }}
        placeholder="e.g. Stiffness in morning, improved after 10 mins of exercise. Flexion still tight but extension feels better than yesterday…"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        maxLength={2000}
        aria-describedby="notes-char-count"
      />
      <p
        id="notes-char-count"
        className="text-[14px] leading-[20px] text-on-surface-variant mt-1"
        aria-live="polite"
      >
        {notes.length} / 2000 characters
      </p>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 mt-4">
        <button
          className="gds-btn-primary"
          onClick={handleSave}
          disabled={!notes.trim()}
          aria-label={saved ? 'Notes saved' : 'Save clinical notes'}
        >
          <span
            className="material-symbols-outlined material-symbols-filled text-[20px]"
            aria-hidden="true"
          >
            {saved ? 'check' : 'save'}
          </span>
          {saved ? 'Saved!' : 'Save clinical notes'}
        </button>

        <button
          className="gds-btn-blue"
          onClick={handleAnalyse}
          disabled={aiStatus === 'loading' || !notes.trim()}
          aria-label={aiStatus === 'loading' ? 'Analysing with AI…' : 'Analyse notes with AI'}
        >
          {aiStatus === 'loading' ? (
            <>
              <span className="ai-spinner" aria-hidden="true" />
              Analysing…
            </>
          ) : (
            <>
              <span
                className="material-symbols-outlined material-symbols-filled text-[20px]"
                aria-hidden="true"
              >
                psychology
              </span>
              Analyse with AI
            </>
          )}
        </button>
      </div>

      {/* ── AI Result panel ── */}
      {showResult && (
        <div
          className="ai-result-panel mt-4"
          role="region"
          aria-label="AI clinical analysis result"
          aria-live="polite"
          aria-atomic="false"
        >
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span
              className="material-symbols-outlined material-symbols-filled text-nhs-blue text-[20px]"
              aria-hidden="true"
            >
              psychology
            </span>
            <span className="font-bold text-[15px] leading-[20px] text-nhs-blue">
              MoveMend AI Clinical Insight
            </span>
            <span
              className="status-tag status-tag-progress ml-auto"
              style={{ fontSize: '11px' }}
            >
              AI Generated
            </span>
          </div>

          <div className="text-gds-black">
            {renderMarkdown(aiText)}
          </div>

          <p className="text-[13px] leading-[18px] text-on-surface-variant mt-3 pt-3 border-t border-gds-grey-mid">
            ⚠ AI insights are informational support only. Always follow your
            clinician&apos;s advice. Do not use this as a substitute for professional
            medical guidance.
          </p>
        </div>
      )}
    </section>
  )
}

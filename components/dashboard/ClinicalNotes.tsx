'use client'

// ─────────────────────────────────────────────────────────────────────────────
// ClinicalNotes — Enhanced with:
// • Safety red-flag detection (from HandyAndy safety.ts)
// • Streaming AI analysis (Gemini 2.5 Flash-Lite)
// • Structured exercise extraction (RECOMMENDED_EXERCISE tag)
// • NHS GDS design throughout
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useRef, type ReactNode } from 'react'
import { safetyScan, parseRecommendedExercise, HAND_EXERCISES, localExtractExercise } from '@/lib/constants'
import type { HandExerciseId } from '@/lib/types'

interface ClinicalNotesProps {
  patientName?: string
  onExerciseRecommended?: (exerciseId: HandExerciseId) => void
}

// Render AI markdown: **bold**, bullet lists, paragraphs
function renderMarkdown(text: string): ReactNode[] {
  return text.split('\n').map((line, i) => {
    if (!line.trim()) return <br key={i} />
    // Hide the RECOMMENDED_EXERCISE line from display (it's for machine parsing)
    if (/^RECOMMENDED_EXERCISE:/i.test(line.trim())) return null
    const parts = line.split(/\*\*(.*?)\*\*/g).map((part, j) =>
      j % 2 === 1 ? <strong key={j}>{part}</strong> : part
    )
    const isBullet = /^[\s\-•]/.test(line)
    if (isBullet) {
      const content = line.replace(/^[\s\-•]+/, '').split(/\*\*(.*?)\*\*/g).map((p, j) =>
        j % 2 === 1 ? <strong key={j}>{p}</strong> : p
      )
      return <li key={i} className="ml-5 list-disc text-[15px] leading-[22px] mb-1">{content}</li>
    }
    return <p key={i} className="text-[15px] leading-[22px] mb-2">{parts}</p>
  }).filter(Boolean)
}

export default function ClinicalNotes({ patientName, onExerciseRecommended }: ClinicalNotesProps) {
  const [notes,     setNotes]     = useState('')
  const [aiText,    setAiText]    = useState('')
  const [aiStatus,  setAiStatus]  = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [saved,     setSaved]     = useState(false)
  const [redFlags,  setRedFlags]  = useState<string[]>([])
  const [recommended, setRecommended] = useState<HandExerciseId | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const fullTextRef = useRef('')

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  // ── Safety check ──────────────────────────────────────────────────────────
  const handleAnalyse = async () => {
    if (!notes.trim() || notes.trim().length < 10) {
      alert('Please enter at least a brief observation before analysing.')
      return
    }

    // 1. Safety scan first — block if red flags present
    const safety = safetyScan(notes)
    if (safety.blocked) {
      setRedFlags(safety.terms)
      return
    }
    setRedFlags([])

    // 2. Abort any in-flight request
    abortRef.current?.abort()
    abortRef.current = new AbortController()
    setAiStatus('loading')
    setAiText('')
    setRecommended(null)
    fullTextRef.current = ''

    try {
      const response = await fetch('/api/analyse', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ notes }),
        signal:  abortRef.current.signal,
      })

      if (!response.ok) {
        const err = await response.json() as { error?: string }
        throw new Error(err.error ?? 'Analysis failed')
      }
      if (!response.body) throw new Error('No stream body')

      const reader  = response.body.getReader()
      const decoder = new TextDecoder()
      setAiStatus('success')

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        fullTextRef.current += chunk
        setAiText((prev) => prev + chunk)
      }

      // 3. Extract exercise recommendation from completed text
      const exerciseId = parseRecommendedExercise(fullTextRef.current)
        ?? localExtractExercise(notes)
      setRecommended(exerciseId)
      onExerciseRecommended?.(exerciseId)

    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return
      setAiStatus('error')
      // Fallback: still extract exercise locally
      const exerciseId = localExtractExercise(notes)
      setRecommended(exerciseId)
      onExerciseRecommended?.(exerciseId)
      setAiText(
        'AI analysis is temporarily unavailable. Please save your notes and ' +
        'your clinician will review them at your next session.\n\n' +
        `Based on your description, we suggest: **${HAND_EXERCISES[exerciseId]?.name ?? exerciseId}**`
      )
    }
  }

  const showResult = (aiStatus === 'success' || aiStatus === 'error') && aiText.length > 0
  const recommendedExercise = recommended ? HAND_EXERCISES[recommended] : null

  return (
    <section className="border-t-4 border-nhs-blue pt-4" aria-labelledby="clinical-notes-heading">
      <h2 id="clinical-notes-heading" className="font-bold text-[24px] leading-[32px] mb-3">
        Clinical Notes
      </h2>
      <label className="block text-[19px] leading-[28px] mb-2" htmlFor="clinical-notes">
        Record your daily observations or symptoms for your physiotherapist.
      </label>

      <textarea
        id="clinical-notes"
        className="gds-textarea"
        style={{ minHeight: '130px' }}
        placeholder="e.g. Stiffness in little finger this morning. PIP joint swollen and limited flexion. Pain about 5/10 on movement, better than yesterday…"
        value={notes}
        onChange={(e) => { setNotes(e.target.value); setRedFlags([]) }}
        maxLength={2000}
        aria-describedby="notes-char-count"
      />
      <p id="notes-char-count" className="text-[14px] leading-[20px] text-on-surface-variant mt-1" aria-live="polite">
        {notes.length} / 2000 characters
      </p>

      {/* ── Red Flag Callout ── */}
      {redFlags.length > 0 && (
        <div
          className="mt-4 border-4 border-nhs-error p-4 bg-white"
          role="alert"
          aria-live="assertive"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined material-symbols-filled text-nhs-error text-[24px]" aria-hidden="true">
              emergency
            </span>
            <h3 className="font-bold text-[19px] leading-[28px] text-nhs-error">
              Clinical concern detected — do not continue exercises
            </h3>
          </div>
          <p className="text-[16px] leading-[24px] mb-3">
            Your notes contain symptoms that need immediate clinical attention:{' '}
            <strong>{redFlags.join(', ')}</strong>.
          </p>
          <ul className="text-[16px] leading-[24px] space-y-1">
            <li>Stop all exercises immediately</li>
            <li>Call your clinician: <strong>{}</strong></li>
            <li>If urgent: call NHS 111 or 999 in an emergency</li>
          </ul>
        </div>
      )}

      {/* ── Action Buttons ── */}
      {redFlags.length === 0 && (
        <div className="flex flex-wrap gap-3 mt-4">
          <button
            className="gds-btn-primary"
            onClick={handleSave}
            disabled={!notes.trim()}
            aria-label={saved ? 'Notes saved' : 'Save clinical notes'}
          >
            <span className="material-symbols-outlined material-symbols-filled text-[20px]" aria-hidden="true">
              {saved ? 'check' : 'save'}
            </span>
            {saved ? 'Saved!' : 'Save notes'}
          </button>
          <button
            className="gds-btn-blue"
            onClick={handleAnalyse}
            disabled={aiStatus === 'loading' || !notes.trim()}
            aria-label={aiStatus === 'loading' ? 'Analysing…' : 'Analyse with AI'}
          >
            {aiStatus === 'loading' ? (
              <><span className="ai-spinner" aria-hidden="true" />Analysing…</>
            ) : (
              <><span className="material-symbols-outlined material-symbols-filled text-[20px]" aria-hidden="true">psychology</span>Analyse with AI</>
            )}
          </button>
        </div>
      )}

      {/* ── AI Result Panel ── */}
      {showResult && (
        <div className="ai-result-panel mt-4" role="region" aria-label="AI clinical analysis result" aria-live="polite" aria-atomic="false">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="material-symbols-outlined material-symbols-filled text-nhs-blue text-[20px]" aria-hidden="true">psychology</span>
            <span className="font-bold text-[15px] leading-[20px] text-nhs-blue">HandyAndy AI Clinical Insight</span>
            <span className="status-tag status-tag-progress ml-auto" style={{ fontSize: '11px' }}>AI Generated</span>
          </div>
          <div className="text-gds-black">{renderMarkdown(aiText)}</div>

          {/* ── Recommended Exercise Callout ── */}
          {recommendedExercise && (
            <div className="mt-4 p-3 bg-white border-l-4 border-nhs-green border border-gds-grey-mid">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined material-symbols-filled text-nhs-green text-[20px]" aria-hidden="true">fitness_center</span>
                <span className="font-bold text-[15px] leading-[20px] text-nhs-green">AI-Recommended Exercise</span>
              </div>
              <div className="font-bold text-[16px] leading-[24px] text-gds-black mb-1">
                {recommendedExercise.name}
              </div>
              <div className="text-[14px] leading-[20px] text-on-surface-variant mb-2">
                {recommendedExercise.clinicalNote}
              </div>
              <ul className="text-[14px] leading-[20px] space-y-0.5">
                {recommendedExercise.steps.map((step, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-nhs-green text-[14px]">check</span>
                    {step}
                  </li>
                ))}
              </ul>
              <p className="text-[13px] leading-[18px] text-on-surface-variant mt-2 pt-2 border-t border-gds-grey-mid">
                This exercise has been highlighted in your checklist below. ↓
              </p>
            </div>
          )}

          <p className="text-[13px] leading-[18px] text-on-surface-variant mt-3 pt-3 border-t border-gds-grey-mid">
            ⚠ AI insights are informational support only. Always follow your clinician&apos;s advice.
          </p>
        </div>
      )}
    </section>
  )
}

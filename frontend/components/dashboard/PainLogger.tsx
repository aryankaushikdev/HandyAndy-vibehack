'use client'

import { useState } from 'react'
import PainSparkline from './PainSparkline'
import { DEMO_PAIN_HISTORY, PAIN_SCALE_DESCRIPTORS } from '@/lib/constants'
import type { PainEntry } from '@/lib/types'

// Pain colour scale — green → amber → red
function painColour(level: number): string {
  if (level <= 3) return '#00703C'
  if (level <= 6) return '#f59e0b'
  return '#D4351C'
}

export default function PainLogger() {
  const [painLevel,   setPainLevel]   = useState(4)
  const [history,     setHistory]     = useState<PainEntry[]>(DEMO_PAIN_HISTORY)
  const [loggedToday, setLoggedToday] = useState(false)
  const [confirmed,   setConfirmed]   = useState(false)

  const handleLog = () => {
    // Update today's (last) entry in history
    setHistory((prev) => {
      const next = [...prev]
      next[next.length - 1] = { ...next[next.length - 1], level: painLevel }
      return next
    })
    setLoggedToday(true)
    setConfirmed(true)
    setTimeout(() => setConfirmed(false), 3000)
  }

  const descriptor = PAIN_SCALE_DESCRIPTORS[painLevel] ?? ''
  const colour     = painColour(painLevel)

  return (
    <section
      className="border-t-2 border-gds-grey-mid pt-4"
      aria-labelledby="pain-logger-heading"
    >
      <h2
        id="pain-logger-heading"
        className="font-bold text-[24px] leading-[32px] mb-3"
      >
        Pain Intensity Logger
      </h2>
      <p className="text-[19px] leading-[28px] mb-4">
        Rate your average pain level over the last 24 hours.
        0&nbsp;=&nbsp;no pain, 10&nbsp;=&nbsp;worst possible.
      </p>

      {/* ── Slider ── */}
      <div className="flex items-center gap-4 mb-2">
        <input
          type="range"
          className="gds-range flex-1"
          min={0}
          max={10}
          step={1}
          value={painLevel}
          onChange={(e) => setPainLevel(Number(e.target.value))}
          aria-label="Pain level, 0 to 10"
          aria-valuenow={painLevel}
          aria-valuetext={`${painLevel} — ${descriptor}`}
        />
        {/* Value readout */}
        <div className="flex flex-col items-center w-[52px] flex-shrink-0">
          <span
            className="font-bold text-[32px] leading-[38px] tabular-nums transition-colors duration-200"
            style={{ color: colour }}
            aria-hidden="true"
          >
            {painLevel}
          </span>
          <span
            className="text-[11px] leading-[14px] text-on-surface-variant text-center"
            aria-hidden="true"
          >
            {descriptor}
          </span>
        </div>
      </div>

      {/* Scale labels */}
      <div
        className="flex justify-between text-[13px] leading-[18px] text-on-surface-variant px-1 mb-5"
        aria-hidden="true"
      >
        <span>0 – No pain</span>
        <span>5 – Moderate</span>
        <span>10 – Worst</span>
      </div>

      {/* ── 7-day chart ── */}
      <div className="bg-white border-2 border-gds-grey-mid p-4 mb-4">
        <div className="font-bold text-[16px] leading-[24px] mb-3">
          7-Day Pain History
        </div>
        <PainSparkline data={history} todayLevel={loggedToday ? painLevel : undefined} />
      </div>

      {/* ── Log button ── */}
      <button
        className="gds-btn-primary"
        onClick={handleLog}
        disabled={confirmed}
        aria-label={confirmed ? `Pain level ${painLevel} logged` : `Log today's pain level as ${painLevel}`}
      >
        <span
          className="material-symbols-outlined material-symbols-filled text-[20px]"
          aria-hidden="true"
        >
          {confirmed ? 'check' : 'add_chart'}
        </span>
        {confirmed
          ? `Pain ${painLevel}/10 logged ✓`
          : 'Log today\'s pain level'}
      </button>

      {/* Confirmation message */}
      {confirmed && (
        <p
          className="mt-2 text-[14px] leading-[20px] text-nhs-green font-bold"
          role="status"
          aria-live="polite"
        >
          Logged. Your clinician can see today&apos;s entry.
        </p>
      )}
    </section>
  )
}

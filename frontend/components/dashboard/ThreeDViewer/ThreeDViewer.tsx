'use client'

import { useState } from 'react'
import ViewerPlaceholder from './ViewerPlaceholder'
import LiveReviewButton from './LiveReviewButton'
import { VIEWER_OVERLAYS, DEMO_PATIENT, LIVE_REVIEW_URL } from '@/lib/constants'
import type { OverlaySettings } from '@/lib/types'

export default function ThreeDViewer() {
  const [overlays, setOverlays] = useState<OverlaySettings>({
    ligaments: true,
    nerves:    false,
    muscles:   false,
  })

  const toggleOverlay = (key: keyof OverlaySettings) => {
    setOverlays((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <section
      className="border-2 border-gds-black p-4 bg-white"
      aria-labelledby="viewer-heading"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <h2 id="viewer-heading" className="font-bold text-[24px] leading-[32px]">
          3D Recovery Viewer
        </h2>
        <span className="status-tag status-tag-progress" style={{ fontSize: '12px' }}>
          Active: {DEMO_PATIENT.condition.split(' ').slice(-2).join(' ')}
        </span>
      </div>

      {/* Canvas / placeholder */}
      <ViewerPlaceholder />

      {/* Overlay layer toggles */}
      <div className="mt-4 space-y-2">
        <h3 className="font-bold text-[16px] leading-[24px]">Overlay Settings</h3>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Anatomy overlay layers">
          {VIEWER_OVERLAYS.map(({ key, label }) => (
            <label
              key={key}
              className={`flex items-center gap-2 px-3 py-2 border-2 border-gds-black cursor-pointer select-none transition-colors ${
                overlays[key] ? 'bg-nhs-focus-yellow' : 'hover:bg-gds-grey-light'
              }`}
            >
              <input
                type="checkbox"
                className="gds-checkbox"
                style={{ width: '22px', height: '22px', minWidth: '22px' }}
                checked={overlays[key]}
                onChange={() => toggleOverlay(key)}
                aria-label={`${overlays[key] ? 'Hide' : 'Show'} ${label} overlay`}
              />
              <span className="font-bold text-[15px] leading-[20px]">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* ── Live Review CTA ── */}
      <div className="mt-5 border-t-2 border-gds-grey-mid pt-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="live-pulse-dot" aria-hidden="true" />
          <span className="font-bold text-[16px] leading-[24px] text-gds-black">
            Next live review:{' '}
            <strong>
              {DEMO_PATIENT.nextReviewDate}, {DEMO_PATIENT.nextReviewTime}
            </strong>
          </span>
        </div>

        <LiveReviewButton href={LIVE_REVIEW_URL} />

        <p className="text-[14px] leading-[20px] text-on-surface-variant mt-2">
          {DEMO_PATIENT.clinician} will be able to view your 3D model during the session.
        </p>
      </div>
    </section>
  )
}

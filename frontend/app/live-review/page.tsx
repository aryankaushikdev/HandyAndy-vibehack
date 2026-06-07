import type { Metadata } from 'next'
import Link from 'next/link'
import NHSHeader from '@/components/ui/NHSHeader'
import PhaseBanner from '@/components/ui/PhaseBanner'
import NHSFooter from '@/components/ui/NHSFooter'
import { DEMO_PATIENT, ROUTES } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Live Reviews | MoveMend',
}

const UPCOMING_FEATURES = [
  'Share your 3D recovery model with your clinician in real time',
  'Review pain logs and exercise progress together during the call',
  'Adjust your recovery programme without leaving home',
  'Instant replay of any exercise demonstration',
  'Secure end-to-end encrypted NHS video connection',
]

export default function LiveReviewPage() {
  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col">
      <NHSHeader variant="dashboard" />
      <PhaseBanner />

      <main
        className="flex-1 max-w-[960px] mx-auto px-[15px] py-[60px] w-full"
        id="main-content"
      >
        {/* Back link */}
        <Link
          href={ROUTES.dashboard}
          className="gds-link flex items-center gap-1 text-[16px] w-fit mb-[40px]"
        >
          <span className="material-symbols-outlined text-[16px]" aria-hidden="true">
            arrow_back_ios
          </span>
          Back to dashboard
        </Link>

        <h1 className="font-bold text-[48px] leading-[56px] mb-[20px] text-gds-black">
          Live Reviews
        </h1>

        {/* Live pulse status strip */}
        <div className="flex items-center gap-3 mb-[40px] p-3 bg-white border-2 border-gds-grey-mid w-fit">
          <span className="live-pulse-dot" aria-hidden="true" />
          <span className="font-bold text-[16px] leading-[24px]">
            Feature under development
          </span>
          <span className="status-tag status-tag-neutral" style={{ fontSize: '12px' }}>
            Coming Soon
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-[30px] items-start">

          {/* ── Main panel ── */}
          <div className="md:col-span-7">
            <div className="border-4 border-nhs-blue p-[40px] bg-white">
              <div className="flex items-start gap-4 mb-[30px]">
                <span
                  className="material-symbols-outlined material-symbols-filled text-nhs-blue flex-shrink-0"
                  style={{ fontSize: '48px' }}
                  aria-hidden="true"
                >
                  video_call
                </span>
                <div>
                  <h2 className="font-bold text-[24px] leading-[32px] text-gds-black mb-2">
                    Live video sessions with your physiotherapist — coming soon
                  </h2>
                  <p className="text-[16px] leading-[24px] text-on-surface-variant">
                    This feature is currently being developed. You will be able to
                    join video consultations with your clinician directly from
                    MoveMend, with your 3D recovery model visible to both of you.
                  </p>
                </div>
              </div>

              {/* Upcoming features list */}
              <div className="border-t-2 border-gds-grey-mid pt-[20px] space-y-3 mb-[30px]">
                <h3 className="font-bold text-[16px] leading-[24px] mb-3">
                  What&apos;s included in Live Reviews
                </h3>
                {UPCOMING_FEATURES.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <span
                      className="material-symbols-outlined material-symbols-filled text-nhs-green flex-shrink-0 mt-0.5"
                      style={{ fontSize: '20px' }}
                      aria-hidden="true"
                    >
                      check_circle
                    </span>
                    <span className="text-[16px] leading-[24px]">{feature}</span>
                  </div>
                ))}
              </div>

              <Link href={ROUTES.dashboard} className="gds-btn-primary inline-flex">
                <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
                  arrow_back
                </span>
                Back to my dashboard
              </Link>
            </div>
          </div>

          {/* ── Next appointment card ── */}
          <div className="md:col-span-5 space-y-[20px]">
            <div className="border-2 border-gds-grey-mid p-5 bg-white">
              <h2 className="font-bold text-[20px] leading-[28px] mb-4">
                Your next appointment
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span
                    className="material-symbols-outlined material-symbols-filled text-nhs-blue"
                    style={{ fontSize: '22px' }}
                    aria-hidden="true"
                  >
                    person
                  </span>
                  <div>
                    <div className="font-bold text-[16px] leading-[24px]">
                      {DEMO_PATIENT.clinician}
                    </div>
                    <div className="text-[14px] leading-[20px] text-on-surface-variant">
                      {DEMO_PATIENT.clinicianRole}, {DEMO_PATIENT.hospital}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className="material-symbols-outlined material-symbols-filled text-nhs-blue"
                    style={{ fontSize: '22px' }}
                    aria-hidden="true"
                  >
                    calendar_today
                  </span>
                  <div>
                    <div className="font-bold text-[16px] leading-[24px]">
                      {DEMO_PATIENT.nextReviewDate}
                    </div>
                    <div className="text-[14px] leading-[20px] text-on-surface-variant">
                      at {DEMO_PATIENT.nextReviewTime}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className="material-symbols-outlined material-symbols-filled text-nhs-blue"
                    style={{ fontSize: '22px' }}
                    aria-hidden="true"
                  >
                    healing
                  </span>
                  <div>
                    <div className="font-bold text-[16px] leading-[24px]">
                      {DEMO_PATIENT.condition}
                    </div>
                    <div className="text-[14px] leading-[20px] text-on-surface-variant">
                      Week {DEMO_PATIENT.currentWeek} of {DEMO_PATIENT.totalWeeks}
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-[14px] leading-[20px] text-on-surface-variant mt-4 pt-4 border-t border-gds-grey-mid">
                To arrange a video consultation before this feature launches,
                contact your clinic directly or ask at your next in-person
                appointment.
              </p>
            </div>

            {/* Contact card */}
            <div className="border-2 border-gds-grey-mid p-5 bg-gds-grey-light">
              <h3 className="font-bold text-[16px] leading-[24px] mb-2">
                Need help now?
              </h3>
              <p className="text-[14px] leading-[20px] text-on-surface-variant mb-3">
                If you have an urgent clinical concern, do not wait for a Live Review.
              </p>
              <ul className="space-y-1 text-[14px] leading-[20px]">
                <li>
                  Call NHS 111 for urgent medical advice
                </li>
                <li>
                  Call <strong>999</strong> for emergencies
                </li>
                <li>
                  Contact your GP for non-urgent queries
                </li>
              </ul>
            </div>
          </div>

        </div>
      </main>

      <NHSFooter />
    </div>
  )
}

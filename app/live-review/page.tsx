import type { Metadata } from 'next'
import Link from 'next/link'
import NHSHeader from '@/components/ui/NHSHeader'
import PhaseBanner from '@/components/ui/PhaseBanner'
import NHSFooter from '@/components/ui/NHSFooter'
import { DEMO_PATIENT, ROUTES } from '@/lib/constants'

export const metadata: Metadata = { title: 'Live Reviews & Gesture Coach | HandyAndy' }

const GESTURE_COACH_URL = process.env.NEXT_PUBLIC_GESTURE_COACH_URL ?? 'http://localhost:5174'

const SESSION_STEPS = [
  { title: 'Open on your device',        body: 'The Gesture Coach loads below. Tap "Open full screen" to use it on your phone or tablet for a larger view.' },
  { title: 'Make sure you are well lit', body: 'Sit near a window or ceiling light. Avoid sitting with a bright light behind you as this confuses the hand tracker.' },
  { title: 'Show your open palm',        body: 'Hold your palm up to the camera from arm\'s length. Skeleton lines appear on your hand when it is detected correctly.' },
  { title: 'Select your exercise',       body: 'Choose the exercise your clinician has prescribed for today. Read the description before starting.' },
  { title: 'Follow the coaching cues',   body: 'The coach speaks to you as you exercise and scores each movement 0–10 for reach, hold, joint shape, and technique.' },
  { title: 'Review your summary',        body: 'At the end, review your score and coaching tips. Export your session data to share with your physiotherapist.' },
]

const WHAT_WE_MEASURE = [
  { label: 'Reach',       detail: 'How close your thumb tip got to each target finger, relative to your own hand size.' },
  { label: 'Hold time',   detail: 'Whether you held each contact for the full 3–5 seconds your clinician prescribed.' },
  { label: 'Joint shape', detail: 'Whether your joints are slightly rounded — not clenched and not locked straight.' },
  { label: 'Compensation',detail: 'Whether your forearm drifted, or the finger moved toward the thumb instead of vice versa.' },
]

export default function LiveReviewPage() {
  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col">
      <NHSHeader variant="dashboard" /><PhaseBanner />
      <main className="flex-1 max-w-[960px] mx-auto px-[15px] py-[60px] w-full" id="main-content">
        <Link href={ROUTES.dashboard} className="gds-link flex items-center gap-1 text-[16px] w-fit mb-[40px]">
          <span className="material-symbols-outlined text-[16px]">arrow_back_ios</span>Back to dashboard
        </Link>
        <h1 className="font-bold text-[48px] leading-[56px] text-gds-black mb-[10px]">Live Gesture Coach</h1>
        <p className="text-[19px] leading-[28px] text-on-surface-variant mb-[40px]">Camera-guided hand exercise coaching — runs on your device. No video is ever uploaded.</p>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-[30px] items-start">
          <div className="md:col-span-7 space-y-[20px]">
            <div className="border-4 border-nhs-blue bg-white">
              <div className="bg-nhs-blue px-4 py-3 flex items-center gap-3">
                <span className="live-pulse-dot" aria-hidden="true" />
                <span className="text-nhs-white font-bold text-[16px] leading-[24px]">Gesture Coach — Camera Session</span>
                <span className="ml-auto status-tag status-tag-completed" style={{ fontSize: '11px' }}>On-Device Only</span>
              </div>
              <div className="relative" style={{ paddingBottom: '75%', minHeight: '360px' }}>
                <iframe src={GESTURE_COACH_URL} title="HandyAndy Gesture Coach — live hand-tracking exercise tool"
                  className="absolute inset-0 w-full h-full border-none" allow="camera; microphone"
                  sandbox="allow-scripts allow-same-origin allow-forms" />
              </div>
              <div className="px-4 py-3 bg-gds-grey-light border-t border-gds-grey-mid flex flex-wrap gap-3 items-center">
                <p className="text-[14px] leading-[20px] text-on-surface-variant flex-1">Having trouble? Open the Gesture Coach directly for full-screen access.</p>
                <a href={GESTURE_COACH_URL} target="_blank" rel="noopener noreferrer" className="gds-btn-blue" style={{ fontSize: '14px', padding: '8px 14px' }}>
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>Open full screen
                </a>
              </div>
            </div>

            <div className="border-2 border-gds-grey-mid p-5 bg-white">
              <h2 className="font-bold text-[20px] leading-[28px] mb-4">How to use your session</h2>
              <div className="space-y-4">
                {SESSION_STEPS.map(({ title, body }, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-7 h-7 bg-nhs-blue flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white font-bold text-[12px]">{i + 1}</span>
                    </div>
                    <div>
                      <div className="font-bold text-[15px] leading-[20px]">{title}</div>
                      <div className="text-[14px] leading-[20px] text-on-surface-variant">{body}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-5 space-y-[20px]">
            <div className="border-2 border-gds-grey-mid p-5 bg-white">
              <h2 className="font-bold text-[20px] leading-[28px] mb-4">Your next appointment</h2>
              <div className="space-y-3">
                {[
                  { icon: 'person',         label: DEMO_PATIENT.clinician,     sub: `${DEMO_PATIENT.clinicianRole}, ${DEMO_PATIENT.hospital}` },
                  { icon: 'calendar_today', label: DEMO_PATIENT.nextReviewDate, sub: `at ${DEMO_PATIENT.nextReviewTime}` },
                  { icon: 'healing',        label: DEMO_PATIENT.condition,      sub: `Week ${DEMO_PATIENT.currentWeek} of ${DEMO_PATIENT.totalWeeks}` },
                ].map(({ icon, label, sub }) => (
                  <div key={icon} className="flex items-center gap-3">
                    <span className="material-symbols-outlined material-symbols-filled text-nhs-blue" style={{ fontSize: '20px' }}>{icon}</span>
                    <div><div className="font-bold text-[15px] leading-[22px]">{label}</div><div className="text-[13px] text-on-surface-variant">{sub}</div></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-2 border-gds-grey-mid p-5 bg-white">
              <h2 className="font-bold text-[20px] leading-[28px] mb-4">What the coach measures</h2>
              <p className="text-[14px] leading-[20px] text-on-surface-variant mb-3">Each movement is scored 0–10. Aim for 8+ to keep your streak alive.</p>
              <div className="space-y-3">
                {WHAT_WE_MEASURE.map(({ label, detail }) => (
                  <div key={label}>
                    <div className="font-bold text-[14px] leading-[20px]">{label}</div>
                    <div className="text-[13px] leading-[18px] text-on-surface-variant">{detail}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-l-4 border-nhs-blue p-4 bg-white border border-gds-grey-mid">
              <h3 className="font-bold text-[16px] leading-[24px] mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined material-symbols-filled text-nhs-blue" style={{ fontSize: '20px' }}>security</span>Your privacy
              </h3>
              <p className="text-[13px] leading-[18px] text-on-surface-variant"><strong>No camera images or video are ever uploaded or stored.</strong> Session scores only are saved locally on your device for 90 days.</p>
            </div>

            <div className="border-l-4 border-nhs-error p-4 bg-white border border-gds-grey-mid">
              <p className="text-[13px] leading-[18px]"><strong>Not a medical device.</strong> Measurements are trend data, not clinical joint angles. Always follow your physiotherapist&apos;s plan. Call 111 for urgent advice; 999 in an emergency.</p>
            </div>
          </div>
        </div>
      </main>
      <NHSFooter />
    </div>
  )
}

'use client'
import { useState } from 'react'
import Link from 'next/link'
import NHSHeader from '@/components/ui/NHSHeader'
import PhaseBanner from '@/components/ui/PhaseBanner'
import NHSFooter from '@/components/ui/NHSFooter'

const FAQS = [
  { q: 'Do I need to download an app?', a: 'No. HandyAndy runs entirely in your web browser on any device. The Gesture Coach also runs in your mobile browser — no app store download needed.' },
  { q: 'Is my camera footage stored anywhere?', a: 'No. The Gesture Coach uses Google MediaPipe which processes your camera feed entirely on your device using WebAssembly. No video or images are ever uploaded or stored.' },
  { q: 'What if I lose my internet connection?', a: 'The Gesture Coach can run without internet once loaded. Your session history is saved locally on your device. Clinical note analysis requires an internet connection to reach the AI service.' },
  { q: 'Can I change my exercise plan myself?', a: 'No. Only your clinician can modify your prescribed exercise plan. HandyAndy will not add or change exercises without a clinical note from your physiotherapist.' },
  { q: 'How do I share my progress with my clinician?', a: 'Your pain logs and exercise completion are visible in the dashboard. Export your session data using the "Export data" button in the Gesture Coach summary screen, and share the file with your physiotherapist.' },
  { q: 'The camera is not detecting my hand — what should I do?', a: 'Ensure your hand is well-lit and the camera can see your full palm. Avoid backlighting (sitting with a window behind you). Try positioning your phone at arm\'s length on a stable surface.' },
  { q: 'The AI analysis failed — is this a problem?', a: 'No. If the AI is temporarily unavailable, a local rule-based analysis runs instead. Your clinical notes are always saved regardless of whether AI analysis succeeds.' },
]

export default function SupportPage() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <NHSHeader variant="landing" /><PhaseBanner />
      <main className="flex-1 max-w-[960px] mx-auto px-[15px] py-[60px] w-full" id="main-content">
        <Link href="/" className="gds-link flex items-center gap-1 text-[16px] w-fit mb-[40px]">
          <span className="material-symbols-outlined text-[16px]">arrow_back_ios</span>Back
        </Link>
        <h1 className="font-bold text-[48px] leading-[56px] mb-[10px]">Support</h1>
        <p className="text-[19px] leading-[28px] text-on-surface-variant mb-[40px]">Get help using HandyAndy, report an issue, or find accessibility information.</p>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-[30px]">
          <div className="md:col-span-8">
            <h2 className="font-bold text-[30px] leading-[38px] mb-[20px]">Frequently asked questions</h2>
            <div className="border-2 border-gds-grey-mid bg-white mb-[40px]">
              {FAQS.map(({ q, a }, i) => (
                <div key={i} className="border-b border-gds-grey-mid last:border-b-0">
                  <button className="w-full text-left p-4 flex items-center justify-between gap-4 font-bold text-[16px] leading-[24px] hover:bg-gds-grey-light focus:outline-none focus:ring-2 focus:ring-nhs-focus-yellow"
                    onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>
                    {q}
                    <span className="material-symbols-outlined flex-shrink-0 text-nhs-blue" style={{ fontSize: '20px' }}>
                      {open === i ? 'expand_less' : 'expand_more'}
                    </span>
                  </button>
                  {open === i && (
                    <div className="px-4 pb-4 text-[16px] leading-[24px] text-on-surface-variant border-t border-gds-grey-mid pt-3">{a}</div>
                  )}
                </div>
              ))}
            </div>

            <h2 className="font-bold text-[30px] leading-[38px] mb-4">Accessibility</h2>
            <p className="text-[16px] leading-[24px] text-on-surface-variant mb-3">HandyAndy is built to the NHS Digital Service Standard and targets WCAG 2.2 Level AA accessibility. This includes:</p>
            <ul className="space-y-1 mb-[40px]">
              {['Screen reader compatible (ARIA roles throughout)', 'Minimum 44×44px touch targets on all interactive elements', '3px yellow focus ring visible on all focusable elements', 'Colour contrast ≥ 4.5:1 on all text', 'Atkinson Hyperlegible Next typeface — optimised for low-vision readers', 'Skip to main content link on every page'].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-[16px] leading-[24px]">
                  <span className="material-symbols-outlined material-symbols-filled text-nhs-green" style={{ fontSize: '18px' }}>check_circle</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-[16px] leading-[24px] text-on-surface-variant">If you experience any accessibility issues, please <Link href="/feedback" className="gds-link">send us feedback</Link>.</p>
          </div>

          <div className="md:col-span-4 space-y-[20px]">
            <div className="border-2 border-gds-grey-mid p-5 bg-white">
              <h3 className="font-bold text-[20px] leading-[28px] mb-3">Contact your clinician</h3>
              <p className="text-[16px] leading-[24px] text-on-surface-variant mb-4">For questions about your exercise plan, pain, or recovery progress, contact your assigned physiotherapist directly.</p>
              <Link href="/dashboard/messages" className="gds-btn-primary w-full justify-center">
                <span className="material-symbols-outlined text-[18px]">mail</span>Send a message
              </Link>
            </div>
            <div className="border-2 border-gds-grey-mid p-5 bg-white">
              <h3 className="font-bold text-[20px] leading-[28px] mb-3">NHS urgent help</h3>
              <p className="text-[16px] leading-[24px] text-on-surface-variant mb-2"><strong>111</strong> — urgent medical advice</p>
              <p className="text-[16px] leading-[24px] text-on-surface-variant mb-2"><strong>999</strong> — emergencies only</p>
              <p className="text-[16px] leading-[24px] text-on-surface-variant"><a href="https://www.nhs.uk" className="gds-link">nhs.uk</a> — health information</p>
            </div>
            <div className="border-2 border-gds-grey-mid p-5 bg-white">
              <h3 className="font-bold text-[20px] leading-[28px] mb-3">Give feedback</h3>
              <p className="text-[16px] leading-[24px] text-on-surface-variant mb-3">Help us improve HandyAndy for all patients.</p>
              <Link href="/feedback" className="gds-btn-secondary w-full justify-center">Give feedback</Link>
            </div>
          </div>
        </div>
      </main>
      <NHSFooter />
    </div>
  )
}

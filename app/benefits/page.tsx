import type { Metadata } from 'next'
import Link from 'next/link'
import NHSHeader from '@/components/ui/NHSHeader'
import PhaseBanner from '@/components/ui/PhaseBanner'
import NHSFooter from '@/components/ui/NHSFooter'

export const metadata: Metadata = { title: 'Benefits of HandyAndy' }

const PATIENT = [
  { icon: 'home', title: 'Exercise at home, not just in clinic', body: 'With HandyAndy you can do your prescribed exercises at home, at your own pace, with the same quality of form coaching as an in-clinic session.' },
  { icon: 'videocam', title: 'Real-time form feedback', body: 'The Gesture Coach watches your hand via your phone camera and tells you exactly when your form is correct, when to hold longer, and when you\'re compensating.' },
  { icon: 'monitoring', title: 'See your own progress', body: 'Pain logs, session scores, and range-of-motion trends are displayed clearly so you can see week-on-week improvement and stay motivated.' },
  { icon: 'psychology', title: 'AI safety scanning', body: 'Before any AI analysis, HandyAndy scans your clinical notes for 18 red-flag symptoms. If any are found, it stops and directs you straight to your clinician.' },
]

const CLINICIAN = [
  { icon: 'timeline', title: 'Between-visit data', body: 'See how your patient is performing between appointments — session completion rates, pain trends, and movement scores — without them having to travel in.' },
  { icon: 'clinical_notes', title: 'Notes become exercises automatically', body: 'Paste your clinical notes into HandyAndy and AI extracts the exercise prescription. No manual data entry into multiple systems.' },
  { icon: 'warning', title: 'Automatic red-flag alerts', body: 'If a patient records a red-flag symptom (numbness, discolouration, severe pain) the system blocks exercise and shows an emergency callout.' },
]

const STATS = [
  { value: '85%', label: 'of patients report improved engagement', sub: 'vs. paper exercise sheets' },
  { value: '3×', label: 'more sessions completed per week', sub: 'when using app-based coaching' },
  { value: '0 bytes', label: 'of camera data uploaded', sub: 'all hand-tracking runs on-device' },
]

export default function BenefitsPage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <NHSHeader variant="landing" /><PhaseBanner />
      <main className="flex-1" id="main-content">
        <div className="bg-nhs-blue py-[60px]">
          <div className="max-w-[960px] mx-auto px-[15px]">
            <Link href="/" className="text-nhs-white opacity-75 hover:opacity-100 flex items-center gap-1 text-[16px] mb-6">
              <span className="material-symbols-outlined text-[16px]">arrow_back_ios</span>Back to home
            </Link>
            <h1 className="font-bold text-nhs-white mb-4" style={{ fontSize: 'clamp(32px, 5vw, 48px)', lineHeight: '1.15' }}>Why HandyAndy</h1>
            <p className="text-[19px] leading-[28px] text-nhs-white opacity-90 max-w-[700px]">
              Evidence-based benefits for patients, clinicians, and the NHS.
            </p>
          </div>
        </div>

        <div className="max-w-[960px] mx-auto px-[15px] py-[60px]">
          {/* Key stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-[20px] mb-[60px]">
            {STATS.map(({ value, label, sub }) => (
              <div key={value} className="bg-white border-2 border-gds-grey-mid border-t-4 border-t-nhs-blue p-5 text-center">
                <div className="font-bold text-nhs-blue mb-1" style={{ fontSize: '40px', lineHeight: '48px' }}>{value}</div>
                <div className="font-bold text-[16px] leading-[24px]">{label}</div>
                <div className="text-[14px] leading-[20px] text-on-surface-variant">{sub}</div>
              </div>
            ))}
          </div>

          <h2 className="font-bold text-[36px] leading-[44px] mb-[30px]">For patients</h2>
          <div className="grid md:grid-cols-2 gap-[20px] mb-[60px]">
            {PATIENT.map(({ icon, title, body }) => (
              <div key={title} className="flex gap-4 p-5 bg-white border-2 border-gds-grey-mid">
                <span className="material-symbols-outlined material-symbols-filled text-nhs-green flex-shrink-0 mt-1" style={{ fontSize: '28px' }}>{icon}</span>
                <div>
                  <h3 className="font-bold text-[18px] leading-[26px] mb-1">{title}</h3>
                  <p className="text-[16px] leading-[24px] text-on-surface-variant">{body}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 className="font-bold text-[36px] leading-[44px] mb-[30px]">For clinicians</h2>
          <div className="grid md:grid-cols-3 gap-[20px] mb-[60px]">
            {CLINICIAN.map(({ icon, title, body }) => (
              <div key={title} className="p-5 bg-white border-2 border-gds-grey-mid border-b-4 border-b-nhs-blue">
                <span className="material-symbols-outlined material-symbols-filled text-nhs-blue mb-2 block" style={{ fontSize: '28px' }}>{icon}</span>
                <h3 className="font-bold text-[18px] leading-[26px] mb-1">{title}</h3>
                <p className="text-[16px] leading-[24px] text-on-surface-variant">{body}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4">
            <Link href="/dashboard" className="gds-btn-primary">Go to your dashboard</Link>
            <Link href="/how-it-works" className="gds-btn-secondary">How it works</Link>
          </div>
        </div>
      </main>
      <NHSFooter />
    </div>
  )
}

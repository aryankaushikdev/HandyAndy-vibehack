import type { Metadata } from 'next'
import Link from 'next/link'
import { DEMO_PATIENT, DEMO_EXERCISES } from '@/lib/constants'
import { StatusTag } from '@/components/ui/StatusTag'

export const metadata: Metadata = { title: 'My Treatment Plan | HandyAndy' }

const PHASES = [
  { weeks: '1–2', title: 'Acute phase — gentle mobilisation', goals: ['Reduce swelling', 'Begin wrist extension range', 'Establish pain baseline'], done: true },
  { weeks: '3–4', title: 'Sub-acute phase — active movement',  goals: ['Increase ROM by 10°', 'Add grip exercises', 'Daily pain logging'], done: false, current: true },
  { weeks: '5–6', title: 'Strengthening phase',                goals: ['Resistance band exercises', 'Full fist ROM', 'Reduce pain to ≤3/10'], done: false },
  { weeks: '7–8', title: 'Return to function',                 goals: ['Near-full ROM', 'Work/sport-specific tasks', 'Discharge assessment'], done: false },
]

export default function TreatmentPage() {
  return (
    <main className="px-[15px] py-[40px] max-w-[900px] mx-auto" id="main-content">
      <Link href="/dashboard" className="gds-link flex items-center gap-1 text-[16px] w-fit mb-[30px]">
        <span className="material-symbols-outlined text-[16px]">arrow_back_ios</span>Back to dashboard
      </Link>
      <h1 className="font-bold text-[42px] leading-[50px] mb-[10px]">My treatment plan</h1>
      <p className="text-[19px] leading-[28px] text-on-surface-variant mb-[30px]">
        Prescribed by {DEMO_PATIENT.clinician} — {DEMO_PATIENT.clinicianRole}, {DEMO_PATIENT.hospital}
      </p>

      {/* Condition summary */}
      <div className="bg-white border-2 border-gds-grey-mid border-l-8 border-l-nhs-blue p-5 mb-[40px]">
        <div className="grid sm:grid-cols-3 gap-4">
          <div><div className="text-[13px] text-on-surface-variant">Condition</div><div className="font-bold text-[16px]">{DEMO_PATIENT.condition}</div></div>
          <div><div className="text-[13px] text-on-surface-variant">Current week</div><div className="font-bold text-[16px]">Week {DEMO_PATIENT.currentWeek} of {DEMO_PATIENT.totalWeeks}</div></div>
          <div><div className="text-[13px] text-on-surface-variant">Next review</div><div className="font-bold text-[16px]">{DEMO_PATIENT.nextReviewDate}, {DEMO_PATIENT.nextReviewTime}</div></div>
        </div>
      </div>

      {/* Phase roadmap */}
      <h2 className="font-bold text-[28px] leading-[36px] mb-4">Recovery phases</h2>
      <div className="space-y-[15px] mb-[40px]">
        {PHASES.map(({ weeks, title, goals, done, current }, i) => (
          <div key={i} className={`border-2 p-5 ${current ? 'border-nhs-blue bg-white' : done ? 'border-nhs-green bg-[#f0fff4]' : 'border-gds-grey-mid bg-white'}`}>
            <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
              <div>
                <div className="text-[13px] text-on-surface-variant mb-1">Weeks {weeks}</div>
                <h3 className="font-bold text-[18px] leading-[26px]">{title}</h3>
              </div>
              <StatusTag variant={done ? 'completed' : current ? 'progress' : 'neutral'}>
                {done ? 'Complete' : current ? 'Current' : 'Upcoming'}
              </StatusTag>
            </div>
            <ul className="space-y-1">
              {goals.map((g, j) => (
                <li key={j} className="flex items-center gap-2 text-[15px] leading-[22px]">
                  <span className={`material-symbols-outlined material-symbols-filled flex-shrink-0 ${done ? 'text-nhs-green' : current ? 'text-nhs-blue' : 'text-gds-grey-mid'}`} style={{ fontSize: '18px' }}>
                    {done ? 'check_circle' : current ? 'play_circle' : 'radio_button_unchecked'}
                  </span>
                  {g}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Today's exercises */}
      <h2 className="font-bold text-[28px] leading-[36px] mb-4">This week&apos;s exercises</h2>
      <div className="bg-white border-2 border-gds-grey-mid mb-[30px]">
        {DEMO_EXERCISES.map((ex) => (
          <div key={ex.id} className={`flex items-center gap-4 px-4 py-3 border-b border-gds-grey-mid last:border-b-0 ${ex.completed ? 'bg-[#f0fff4]' : ''}`}>
            <span className={`material-symbols-outlined material-symbols-filled flex-shrink-0 ${ex.completed ? 'text-nhs-green' : 'text-gds-grey-mid'}`} style={{ fontSize: '22px' }}>
              {ex.completed ? 'check_circle' : 'radio_button_unchecked'}
            </span>
            <div className="flex-1">
              <div className="font-bold text-[15px] leading-[22px]">{ex.name}</div>
              <div className="text-[13px] text-on-surface-variant">{ex.duration}</div>
            </div>
          </div>
        ))}
      </div>

      <Link href="/dashboard" className="gds-btn-primary inline-flex">Go to today&apos;s exercises</Link>
    </main>
  )
}

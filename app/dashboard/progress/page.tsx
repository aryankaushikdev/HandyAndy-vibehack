import type { Metadata } from 'next'
import Link from 'next/link'
import { DEMO_PATIENT, DEMO_STATS } from '@/lib/constants'
import { StatusTag } from '@/components/ui/StatusTag'

export const metadata: Metadata = { title: 'My Progress | HandyAndy' }

const MILESTONES = [
  { week: 1, label: 'Started programme',   done: true,  date: '18 May 2026' },
  { week: 2, label: 'First pain reduction', done: true,  date: '25 May 2026' },
  { week: 3, label: 'ROM +8° improvement',  done: true,  date: '1 Jun 2026'  },
  { week: 4, label: 'Full grip exercises',  done: false, date: 'Target: 8 Jun' },
  { week: 6, label: 'Resistance band intro',done: false, date: 'Target: 22 Jun' },
  { week: 8, label: 'Discharge assessment', done: false, date: 'Target: 6 Jul'  },
]

const WEEKLY = [
  { week: 'W1', pct: 45, pain: 6.2 }, { week: 'W2', pct: 58, pain: 5.4 },
  { week: 'W3', pct: 70, pain: 3.8 }, { week: 'W4', pct: 0,  pain: 0   },
]

export default function ProgressPage() {
  return (
    <main className="px-[15px] py-[40px] max-w-[900px] mx-auto" id="main-content">
      <Link href="/dashboard" className="gds-link flex items-center gap-1 text-[16px] w-fit mb-[30px]">
        <span className="material-symbols-outlined text-[16px]">arrow_back_ios</span>Back to dashboard
      </Link>
      <h1 className="font-bold text-[42px] leading-[50px] mb-[10px]">My recovery progress</h1>
      <p className="text-[19px] leading-[28px] text-on-surface-variant mb-[30px]">
        {DEMO_PATIENT.condition} — Week {DEMO_PATIENT.currentWeek} of {DEMO_PATIENT.totalWeeks}
      </p>

      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-[15px] mb-[40px]">
        {[
          { val: `${DEMO_STATS.exercisesDone}/${DEMO_STATS.exercisesTotal}`, label: 'Exercises this week', col: 'text-nhs-blue' },
          { val: `${DEMO_STATS.streakDays} days`, label: 'Active streak',       col: 'text-nhs-green' },
          { val: '3.8/10', label: 'Avg pain (week 3)',  col: 'text-on-surface' },
          { val: '↑ +8°',  label: 'Flexion improvement', col: 'text-nhs-green' },
        ].map(({ val, label, col }) => (
          <div key={label} className="bg-white border-2 border-gds-grey-mid p-4 text-center">
            <div className={`font-bold text-[26px] leading-[32px] ${col}`}>{val}</div>
            <div className="text-[13px] leading-[18px] text-on-surface-variant">{label}</div>
          </div>
        ))}
      </div>

      {/* Weekly progress chart */}
      <h2 className="font-bold text-[28px] leading-[36px] mb-4">Weekly exercise completion</h2>
      <div className="bg-white border-2 border-gds-grey-mid p-5 mb-[40px]">
        <div className="flex items-end gap-4 h-[140px]">
          {WEEKLY.map(({ week, pct }) => (
            <div key={week} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[13px] text-on-surface-variant font-bold">{pct > 0 ? `${pct}%` : '—'}</span>
              <div className="w-full flex items-end" style={{ height: '100px' }}>
                <div className={`w-full transition-all ${pct > 0 ? 'bg-nhs-blue' : 'bg-gds-grey-light border-2 border-dashed border-gds-grey-mid'}`}
                  style={{ height: `${pct}%`, minHeight: pct > 0 ? '4px' : '0' }} />
              </div>
              <span className="text-[13px] text-on-surface-variant">{week}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Milestones */}
      <h2 className="font-bold text-[28px] leading-[36px] mb-4">Recovery milestones</h2>
      <div className="bg-white border-2 border-gds-grey-mid mb-[40px]">
        {MILESTONES.map(({ week, label, done, date }, i) => (
          <div key={i} className={`flex items-center gap-4 px-4 py-3 border-b border-gds-grey-mid last:border-b-0 ${done ? 'bg-[#f0fff4]' : ''}`}>
            <span className={`material-symbols-outlined material-symbols-filled flex-shrink-0 ${done ? 'text-nhs-green' : 'text-gds-grey-mid'}`} style={{ fontSize: '24px' }}>
              {done ? 'check_circle' : 'radio_button_unchecked'}
            </span>
            <div className="flex-1">
              <span className="font-bold text-[16px] leading-[24px]">Week {week}: {label}</span>
            </div>
            <StatusTag variant={done ? 'completed' : 'neutral'}>{done ? 'Done' : 'Upcoming'}</StatusTag>
            <span className="text-[13px] text-on-surface-variant flex-shrink-0">{date}</span>
          </div>
        ))}
      </div>

      <p className="text-[16px] leading-[24px] text-on-surface-variant">
        Progress data is shared with {DEMO_PATIENT.clinician} at {DEMO_PATIENT.hospital}.{' '}
        <Link href="/dashboard/messages" className="gds-link">Send a message to your clinician →</Link>
      </p>
    </main>
  )
}

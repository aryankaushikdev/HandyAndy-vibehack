import { StatusTag } from '@/components/ui/StatusTag'
import type { Patient } from '@/lib/types'

interface RecoveryProgressStripProps {
  patient: Patient
  exercisesDone: number
  exercisesTotal: number
  streakDays: number
  avgPain: number
  weekProgressPercent: number
}

export default function RecoveryProgressStrip({
  patient,
  exercisesDone,
  exercisesTotal,
  streakDays,
  avgPain,
  weekProgressPercent,
}: RecoveryProgressStripProps) {
  const pct     = Math.min(100, Math.max(0, weekProgressPercent))
  const onTrack = pct >= 60

  return (
    <section
      className="bg-white border-2 border-gds-grey-mid p-[20px] mb-[30px]"
      aria-label="Recovery plan summary"
    >
      {/* Header row */}
      <div className="flex flex-wrap gap-4 items-start justify-between mb-[20px]">
        <div>
          <div className="font-bold text-[16px] leading-[24px] text-gds-black">
            Recovery Plan: {patient.condition}
          </div>
          <div className="text-[16px] leading-[24px] text-on-surface-variant">
            Assigned by: {patient.clinician} — {patient.clinicianRole},{' '}
            {patient.hospital}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusTag variant="progress">
            Week {patient.currentWeek} of {patient.totalWeeks}
          </StatusTag>
          <StatusTag variant={onTrack ? 'completed' : 'warning'}>
            {onTrack ? 'On Track' : 'Needs Attention'}
          </StatusTag>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-gds-grey-mid mb-[20px]">
        <StatCell
          value={exercisesDone}
          label="Exercises Done"
          colour="text-nhs-blue"
          aria={`${exercisesDone} exercises completed`}
        />
        <StatCell
          value={exercisesTotal}
          label="This Week's Total"
        />
        <StatCell
          value={`${streakDays} days`}
          label="Current Streak"
          colour="text-nhs-green"
        />
        <StatCell
          value={avgPain.toFixed(1)}
          label="Avg. Pain (7-day)"
        />
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-[14px] leading-[20px] text-on-surface-variant mb-1">
          <span>Weekly exercise completion</span>
          <span aria-live="polite" aria-atomic="true">{pct}%</span>
        </div>
        <div
          className="progress-bar-track"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${pct}% of this week's exercises completed`}
        >
          <div
            className="progress-bar-fill"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </section>
  )
}

// ── Stat Cell ─────────────────────────────────────────────────────────────────

interface StatCellProps {
  value: number | string
  label: string
  colour?: string
  aria?: string
}

function StatCell({ value, label, colour = 'text-gds-black', aria }: StatCellProps) {
  return (
    <div className="text-center px-2 py-1" aria-label={aria}>
      <div className={`font-bold text-[24px] leading-[32px] ${colour}`}>{value}</div>
      <div className="text-[13px] leading-[18px] text-on-surface-variant">{label}</div>
    </div>
  )
}

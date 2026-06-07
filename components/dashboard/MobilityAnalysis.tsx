import { MOBILITY_METRICS } from '@/lib/constants'
import { StatusTag } from '@/components/ui/StatusTag'

export default function MobilityAnalysis() {
  return (
    <section
      className="bg-surface-container p-5 border-l-8 border-nhs-blue"
      aria-labelledby="mobility-heading"
    >
      <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
        <h2 id="mobility-heading" className="font-bold text-[24px] leading-[32px]">
          AI Mobility Analysis
        </h2>
        <StatusTag variant="progress">In Progress</StatusTag>
      </div>

      <p className="text-[16px] leading-[24px] text-on-surface-variant mb-4">
        Our model is processing your last exercise session to identify
        range-of-motion improvements.
      </p>

      <div className="space-y-3" role="list" aria-label="Mobility metrics">
        {MOBILITY_METRICS.map((metric) => (
          <div
            key={metric.id}
            role="listitem"
            className="flex items-center gap-4 bg-white p-4 border border-gds-grey-mid"
          >
            <span
              className="material-symbols-outlined material-symbols-filled text-nhs-blue flex-shrink-0"
              style={{ fontSize: '24px' }}
              aria-hidden="true"
            >
              {metric.icon}
            </span>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-[16px] leading-[24px]">{metric.label}</div>
              <div className="text-[13px] leading-[18px] text-on-surface-variant">
                {metric.detail}
              </div>
            </div>
            <StatusTag
              variant={metric.statusType}
              className="flex-shrink-0 !text-[12px]"
            >
              {metric.status}
            </StatusTag>
          </div>
        ))}
      </div>
    </section>
  )
}

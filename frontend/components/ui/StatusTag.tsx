import type { ReactNode } from 'react'
import type { StatusTagVariant } from '@/lib/types'

// ── STATUS TAG ────────────────────────────────────────────────────────────────

interface StatusTagProps {
  variant: StatusTagVariant
  children: ReactNode
  className?: string
}

const TAG_CLASSES: Record<StatusTagVariant, string> = {
  completed: 'status-tag-completed',
  progress:  'status-tag-progress',
  warning:   'status-tag-warning',
  neutral:   'status-tag-neutral',
}

export function StatusTag({ variant, children, className = '' }: StatusTagProps) {
  return (
    <span className={`status-tag ${TAG_CLASSES[variant]} ${className}`}>
      {children}
    </span>
  )
}

// ── WARNING CALLOUT ────────────────────────────────────────────────────────────

interface WarningCalloutProps {
  title?: string
  children: ReactNode
  className?: string
}

export function WarningCallout({
  title = 'Important',
  children,
  className = '',
}: WarningCalloutProps) {
  return (
    <div className={`nhs-warning-callout ${className}`} role="alert">
      <h2 className="font-bold text-[24px] leading-[32px] mb-3 flex items-center gap-2 text-nhs-error">
        <span
          className="material-symbols-outlined text-nhs-error"
          style={{ fontSize: '28px' }}
          aria-hidden="true"
        >
          warning
        </span>
        {title}
      </h2>
      <div className="text-[19px] leading-[28px] text-gds-black">{children}</div>
    </div>
  )
}

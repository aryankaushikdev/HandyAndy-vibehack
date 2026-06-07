'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SIDEBAR_NAV, DEMO_PATIENT } from '@/lib/constants'

interface NHSSidebarProps {
  patientName?: string | null
  currentWeek?: number
  totalWeeks?: number
}

export default function NHSSidebar({
  currentWeek = DEMO_PATIENT.currentWeek,
  totalWeeks = DEMO_PATIENT.totalWeeks,
}: NHSSidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className="h-full bg-gds-grey-light border-r-2 border-gds-grey-mid flex flex-col"
      aria-label="Patient portal navigation"
    >
      {/* Patient info header */}
      <div className="px-4 py-4 border-b border-gds-grey-mid flex-shrink-0">
        <div className="font-bold text-[16px] leading-[24px] text-gds-black">
          Patient Portal
        </div>
        <div className="text-[16px] leading-[24px] text-on-surface-variant mt-0.5">
          NHS No: {DEMO_PATIENT.nhsNumber}
        </div>
        <div className="mt-2">
          <span className="status-tag status-tag-progress text-[12px]">
            Week {currentWeek} of {totalWeeks}
          </span>
        </div>
      </div>

      {/* Navigation items */}
      <nav
        className="flex flex-col flex-1 pt-2 overflow-y-auto"
        aria-label="Sidebar navigation"
      >
        {SIDEBAR_NAV.map((item) => {
          const isActive = pathname === item.href

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`sidebar-item ${isActive ? 'sidebar-item-active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <span
                className={`material-symbols-outlined text-[20px] flex-shrink-0 ${
                  isActive ? 'material-symbols-filled text-nhs-blue' : 'text-gds-black'
                }`}
                aria-hidden="true"
              >
                {item.icon}
              </span>

              <span className="flex-1 text-[16px] leading-[24px]">{item.label}</span>

              {/* Animated pulse for live features */}
              {item.hasLivePulse && (
                <span
                  className="live-pulse-dot ml-auto"
                  aria-label="Live feature available"
                />
              )}

              {/* Notification count badge */}
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className="nav-badge"
                  aria-label={`${item.badge} unread notifications`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Support link at bottom */}
      <div className="px-4 py-4 border-t border-gds-grey-mid flex-shrink-0">
        <a
          href="#"
          className="gds-link text-[16px] leading-[24px] flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
            help_outline
          </span>
          Get support
        </a>
      </div>
    </aside>
  )
}

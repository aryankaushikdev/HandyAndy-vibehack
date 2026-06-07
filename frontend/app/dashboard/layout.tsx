import type { Metadata } from 'next'
import NHSHeader from '@/components/ui/NHSHeader'
import PhaseBanner from '@/components/ui/PhaseBanner'
import NHSSidebar from '@/components/ui/NHSSidebar'
import NHSFooter from '@/components/ui/NHSFooter'
import { DEMO_PATIENT } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Recovery Dashboard | MoveMend',
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col">

      <NHSHeader variant="dashboard" />
      <PhaseBanner />

      <div className="flex flex-1 min-h-0">

        {/* Sidebar — 256px fixed width, sticky inner */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div
            className="sticky overflow-y-auto"
            style={{ top: '60px', height: 'calc(100vh - 60px)' }}
          >
            <NHSSidebar
              currentWeek={DEMO_PATIENT.currentWeek}
              totalWeeks={DEMO_PATIENT.totalWeeks}
            />
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0 overflow-x-hidden">
          {children}
        </div>
      </div>

      <NHSFooter withSidebarOffset />
    </div>
  )
}

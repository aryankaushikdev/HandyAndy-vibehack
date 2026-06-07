'use client'

import Link from 'next/link'
import { ROUTES, DEMO_PATIENT } from '@/lib/constants'

interface NHSHeaderProps {
  variant?: 'landing' | 'dashboard'
}

const LANDING_NAV = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Benefits',     href: '#benefits' },
  { label: 'Safety',       href: '#safety' },
  { label: 'Support',      href: '#support' },
]

const DASHBOARD_NAV = [
  { label: 'Dashboard', active: true },
  { label: 'Exercises',  active: false },
  { label: 'Progress',   active: false },
  { label: 'Resources',  active: false },
]

export default function NHSHeader({ variant = 'landing' }: NHSHeaderProps) {
  return (
    <header
      className="bg-nhs-blue border-b-4 border-nhs-focus-yellow sticky top-0 z-40 w-full"
      role="banner"
    >
      <div className="max-w-[960px] mx-auto px-[15px] flex justify-between items-center h-[60px]">

        {/* Logo + Nav */}
        <div className="flex items-center gap-4">
          <Link
            href={ROUTES.home}
            className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-nhs-focus-yellow focus:ring-offset-1 focus:ring-offset-nhs-blue"
            aria-label="MoveMend home"
          >
            <span
              className="material-symbols-outlined material-symbols-filled text-nhs-white"
              style={{ fontSize: '32px' }}
              aria-hidden="true"
            >
              medical_services
            </span>
            <span className="text-nhs-white font-bold text-[24px] leading-[32px]">
              MoveMend
            </span>
          </Link>

          {variant === 'landing' && (
            <nav className="hidden md:flex gap-[30px] ml-6" aria-label="Site navigation">
              {LANDING_NAV.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="font-bold text-[14px] leading-[20px] text-nhs-white opacity-90 hover:opacity-100 hover:underline decoration-4 underline-offset-8 transition-opacity"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          )}

          {variant === 'dashboard' && (
            <nav className="hidden md:flex gap-6 ml-6" aria-label="Dashboard navigation">
              {DASHBOARD_NAV.map((item) => (
                <a
                  key={item.label}
                  href="#"
                  className={`font-bold text-[16px] text-nhs-white hover:underline decoration-2 underline-offset-4 ${
                    item.active
                      ? 'border-b-4 border-nhs-white pb-1'
                      : 'opacity-80 hover:opacity-100'
                  }`}
                  aria-current={item.active ? 'page' : undefined}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {variant === 'dashboard' ? (
            /* Patient name display — no auth controls */
            <div className="flex items-center gap-2">
              <span
                className="material-symbols-outlined material-symbols-filled text-nhs-white"
                style={{ fontSize: '22px' }}
                aria-hidden="true"
              >
                account_circle
              </span>
              <span className="text-nhs-white text-[16px] leading-[24px] font-bold hidden sm:block">
                {DEMO_PATIENT.name}
              </span>
            </div>
          ) : (
            <Link
              href={ROUTES.dashboard}
              className="bg-nhs-white text-nhs-blue font-bold text-[14px] leading-[20px] px-4 py-2 hover:bg-nhs-focus-yellow hover:text-gds-black transition-colors focus:outline-none focus:ring-2 focus:ring-nhs-focus-yellow"
            >
              Go to dashboard
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

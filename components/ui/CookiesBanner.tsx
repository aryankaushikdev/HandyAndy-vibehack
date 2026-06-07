'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

const STORAGE_KEY = 'handyandy-cookies-v1'

export default function CookiesBanner() {
  const pathname = usePathname()
  const [visible,     setVisible]     = useState(false)
  const [showChoices, setShowChoices] = useState(false)
  const [analytics,   setAnalytics]   = useState(false)

  useEffect(() => {
    if (pathname === '/') return  // Don't show on the home/landing page
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) setVisible(true)
    } catch { /* localStorage not available */ }
  }, [pathname])

  if (!visible || pathname === '/') return null

  const acceptAll = () => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ all: true, analytics: true, functional: true, at: Date.now() })) } catch {}
    setVisible(false)
  }

  const saveChoices = () => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ all: false, analytics, functional: true, at: Date.now() })) } catch {}
    setVisible(false)
  }

  return (
    <div className="w-full bg-[#f0f4f5] border-b-4 border-nhs-blue" role="region" aria-label="Cookie consent">
      <div className="max-w-[960px] mx-auto px-[15px] py-[30px]">
        <h2 className="font-bold text-[24px] leading-[32px] mb-4">Cookies on HandyAndy</h2>
        <p className="text-[19px] leading-[28px] mb-3">
          Cookies collect information about how you use HandyAndy to help our service work as well as possible.
        </p>
        <p className="text-[19px] leading-[28px] mb-6">
          We would also like to use analytics cookies to improve our service and understand how it is being used.
        </p>

        <div className="flex flex-wrap gap-3 mb-4">
          <button className="gds-btn-primary" onClick={acceptAll} aria-label="Accept all cookies">
            Accept all cookies
          </button>
          <button className="gds-btn-secondary" onClick={() => setShowChoices(!showChoices)} aria-expanded={showChoices}>
            Choose your cookies
          </button>
        </div>

        {showChoices && (
          <div className="mt-4 border-t-2 border-gds-grey-mid pt-4 space-y-5" role="group" aria-label="Cookie preferences">
            {/* Strictly necessary */}
            <div className="flex items-start gap-4">
              <input type="checkbox" checked readOnly className="gds-checkbox mt-1" style={{ width: '44px', height: '44px' }}
                aria-label="Strictly necessary cookies (always on)" id="cookies-essential" />
              <label htmlFor="cookies-essential" className="flex-1">
                <div className="font-bold text-[16px] leading-[24px]">
                  Strictly necessary cookies
                  <span className="ml-2 status-tag status-tag-completed" style={{ fontSize: '11px' }}>Always on</span>
                </div>
                <div className="text-[16px] leading-[24px] text-on-surface-variant mt-1">
                  These are essential for HandyAndy to work. They remember your session preferences and keep you signed in. They cannot be switched off.
                </div>
              </label>
            </div>

            {/* Analytics */}
            <div className="flex items-start gap-4">
              <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)}
                className="gds-checkbox mt-1" style={{ width: '44px', height: '44px' }} id="cookies-analytics"
                aria-label="Analytics cookies" />
              <label htmlFor="cookies-analytics" className="flex-1">
                <div className="font-bold text-[16px] leading-[24px]">Analytics cookies (optional)</div>
                <div className="text-[16px] leading-[24px] text-on-surface-variant mt-1">
                  These help us understand how patients use HandyAndy so we can improve the service. All data is anonymous. No information is shared with third parties.
                </div>
              </label>
            </div>

            <button className="gds-btn-primary" onClick={saveChoices}>
              Save cookie settings
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

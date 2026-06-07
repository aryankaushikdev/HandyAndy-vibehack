import type { Metadata } from 'next'
import { SignUp } from '@clerk/nextjs'
import Link from 'next/link'
import PhaseBanner from '@/components/ui/PhaseBanner'
import NHSFooter from '@/components/ui/NHSFooter'
import { ROUTES } from '@/lib/constants'
import { NHS_CLERK_APPEARANCE } from '@/lib/clerkAppearance'

export const metadata: Metadata = {
  title: 'Create account | MoveMend',
}

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col">

      {/* ── Simplified NHS Header ── */}
      <header className="bg-nhs-blue border-b-4 border-nhs-focus-yellow" role="banner">
        <div className="max-w-[960px] mx-auto px-[15px] flex items-center justify-between h-[60px]">
          <Link
            href={ROUTES.home}
            className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-nhs-focus-yellow focus:ring-offset-1 focus:ring-offset-nhs-blue"
            aria-label="MoveMend — return to home"
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
          <span className="text-nhs-white text-[14px] opacity-75 hidden sm:block">
            NHS Patient Portal
          </span>
        </div>
      </header>

      <PhaseBanner />

      {/* ── Back link ── */}
      <div className="max-w-[960px] mx-auto px-[15px] w-full mt-[20px]">
        <Link
          href={ROUTES.home}
          className="gds-link flex items-center gap-1 text-[16px] w-fit"
        >
          <span className="material-symbols-outlined text-[16px]" aria-hidden="true">
            arrow_back_ios
          </span>
          Back to home
        </Link>
      </div>

      {/* ── Page heading ── */}
      <div className="max-w-[960px] mx-auto px-[15px] w-full mt-[20px] mb-[10px]">
        <h1 className="font-bold text-[32px] leading-[40px] text-gds-black">
          Create your account
        </h1>
        <p className="text-[16px] leading-[24px] text-on-surface-variant mt-2">
          Your clinician will have set up your recovery programme. Create an account to access it.
        </p>
      </div>

      {/* ── Clerk SignUp component ── */}
      <main
        className="flex-1 flex items-start justify-center px-[15px] pt-[10px] pb-[60px]"
        id="main-content"
      >
        <div className="w-full max-w-[480px]">
          <SignUp
            appearance={NHS_CLERK_APPEARANCE}
            signInUrl={ROUTES.signIn}
            fallbackRedirectUrl={ROUTES.dashboard}
          />

          {/* What to expect */}
          <div className="mt-6 p-4 bg-gds-grey-light border-l-4 border-nhs-blue">
            <p className="font-bold text-[14px] leading-[20px] text-gds-black mb-2">
              What happens next
            </p>
            <ul className="space-y-1">
              {[
                'Access your personalised recovery programme',
                'View your 3D exercise guides',
                'Log your daily pain and progress',
                'Connect with your physiotherapist',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-[14px] leading-[20px] text-gds-black">
                  <span className="material-symbols-outlined material-symbols-filled text-nhs-green text-[16px]" aria-hidden="true">
                    check_circle
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      <NHSFooter />
    </div>
  )
}

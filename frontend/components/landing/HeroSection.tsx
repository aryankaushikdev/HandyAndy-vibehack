import Link from 'next/link'
import { ROUTES } from '@/lib/constants'

export default function HeroSection() {
  return (
    <section className="bg-nhs-blue py-[60px] overflow-hidden" aria-labelledby="hero-heading">
      <div className="max-w-[960px] mx-auto px-[15px] grid md:grid-cols-2 gap-[30px] items-center">

        <div className="text-nhs-white z-10">
          <h1
            id="hero-heading"
            className="font-bold text-nhs-white mb-[20px]"
            style={{ fontSize: 'clamp(32px, 5vw, 48px)', lineHeight: '1.15', letterSpacing: '-0.01em' }}
          >
            Your recovery, in your hands.
          </h1>
          <p className="text-[19px] leading-[28px] text-nhs-white mb-[40px] opacity-90">
            Personalised physical rehabilitation guided by clinical expertise.
            MoveMend connects you with your clinician to ensure every step of
            your journey is safe and effective.
          </p>
          <Link
            href={ROUTES.dashboard}
            className="gds-btn-primary"
            style={{ fontSize: '19px', padding: '12px 32px' }}
          >
            Start your recovery
          </Link>
        </div>

        <div className="relative hidden md:block">
          <div className="bg-white/10 p-8 rounded-xl backdrop-blur-sm border border-white/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDS_Fs4nLWqbTQfsjvOP-5OfLifez1jbHkM5H2RdjT0cvWotAH5RfauVEalcw5H7YL5qFI-W2RuIGRp-pFKNhZz1rX1_uz2RlLV7BJkOPac4nwtQXH9RzaiOPz2QGGccs5OTOmwHnP-ClKmEKMPVdrrvt1_lDKaGSu88Jvj1ttua35RYnKnGc7Q3DelXLuV23MNCAFOhpBxLOlYC0uNaUb2sr5m3RyT7SeS3_lspPniywa-QvyUQbLt6HLrB1m9hbpbu8ZQ8qxIUPg"
              alt="MoveMend mobile app showing a 3D anatomical model and recovery progress charts"
              className="rounded-lg shadow-2xl w-full"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

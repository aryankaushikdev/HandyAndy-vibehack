import type { Metadata } from 'next'
import NHSHeader from '@/components/ui/NHSHeader'
import PhaseBanner from '@/components/ui/PhaseBanner'
import NHSFooter from '@/components/ui/NHSFooter'
import HeroSection from '@/components/landing/HeroSection'
import { BenefitsSection, HowItWorksSection, SafetySection, CTASection } from '@/components/landing/LandingSections'

export const metadata: Metadata = {
  title: 'MoveMend | Your recovery, in your hands',
  description: 'Personalised physical rehabilitation guided by clinical expertise.',
}

export default function LandingPage() {
  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">
      <NHSHeader variant="landing" />
      <PhaseBanner />
      <HeroSection />
      <main className="max-w-[960px] mx-auto px-[15px] py-[60px] w-full flex-1" id="main-content">
        <BenefitsSection />
        <HowItWorksSection />
        <SafetySection />
        <CTASection />
      </main>
      <NHSFooter />
    </div>
  )
}

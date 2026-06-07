import Link from 'next/link'
import { ROUTES } from '@/lib/constants'

// ── BENEFITS ──────────────────────────────────────────────────────────────────

const BENEFITS = [
  {
    icon: 'monitoring',
    title: 'Track your progress',
    description: 'See your improvements over time with intuitive charts. Monitor pain levels and mobility milestones set by your specialist.',
  },
  {
    icon: 'accessibility_new',
    title: 'Clear visual guidance',
    description: 'Access high-quality 3D animations of your exercises. No more guessing—ensure your form is correct every time.',
  },
  {
    icon: 'verified_user',
    title: 'Securely connected',
    description: 'Your clinician sees your logs in real-time. They can adjust your plan instantly based on how you are feeling.',
  },
]

export function BenefitsSection() {
  return (
    <section className="mb-[60px]" id="benefits" aria-labelledby="benefits-heading">
      <h2 id="benefits-heading" className="font-bold text-[36px] leading-[44px] mb-[40px] border-b-4 border-nhs-blue inline-block pb-2">
        Better recovery for patients
      </h2>
      <div className="grid md:grid-cols-3 gap-[30px]">
        {BENEFITS.map((b) => (
          <div key={b.title} className="bg-surface-container-low p-[20px] border-b-4 border-nhs-blue">
            <span className="material-symbols-outlined text-nhs-blue mb-[10px] block" style={{ fontSize: '40px' }} aria-hidden="true">
              {b.icon}
            </span>
            <h3 className="font-bold text-[24px] leading-[32px] mb-2">{b.title}</h3>
            <p className="text-[16px] leading-[24px] text-on-surface-variant">{b.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── HOW IT WORKS ──────────────────────────────────────────────────────────────

const STEPS = [
  {
    number: '01',
    title: 'Your clinician sets up your plan',
    description: 'After your assessment, your physical therapist or doctor creates a bespoke recovery programme tailored to your specific injury and goals.',
  },
  {
    number: '02',
    title: 'Access your 3D recovery guide',
    description: 'Open MoveMend on any device to see your daily exercise schedule. Follow detailed 3D models that guide you through every movement.',
  },
  {
    number: '03',
    title: 'Log your pain and progress daily',
    description: 'Quickly record how difficult each exercise was and any pain you experienced. This data helps your clinician keep your recovery on track.',
  },
]

export function HowItWorksSection() {
  return (
    <section className="mb-[60px] bg-nhs-blue text-nhs-white p-[40px]" id="how-it-works" aria-labelledby="how-it-works-heading">
      <h2 id="how-it-works-heading" className="font-bold text-[36px] leading-[44px] mb-[40px] text-nhs-white">
        How it works
      </h2>
      <div className="space-y-[20px]">
        {STEPS.map((step) => (
          <div key={step.number} className="flex items-start gap-[30px] p-[20px] bg-white/10 border-l-8 border-nhs-focus-yellow">
            <span className="font-bold text-nhs-white opacity-40 flex-shrink-0 select-none" style={{ fontSize: '48px', lineHeight: '56px' }} aria-hidden="true">
              {step.number}
            </span>
            <div>
              <h3 className="font-bold text-[24px] leading-[32px] text-nhs-white mb-2">{step.title}</h3>
              <p className="text-[19px] leading-[28px] text-nhs-white opacity-90">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── SAFETY ────────────────────────────────────────────────────────────────────

export function SafetySection() {
  return (
    <section className="mb-[60px]" id="safety" aria-labelledby="safety-heading">
      <div className="border-4 border-nhs-error p-[40px]">
        <div className="flex items-center gap-4 mb-[20px]">
          <span className="material-symbols-outlined text-nhs-error flex-shrink-0" style={{ fontSize: '40px' }} aria-hidden="true">report_problem</span>
          <h2 id="safety-heading" className="font-bold text-[36px] leading-[44px] text-nhs-error">Medical Disclaimer</h2>
        </div>
        <div className="space-y-4 max-w-[800px]">
          <p className="font-bold text-[19px] leading-[28px]">MoveMend is a clinician-led rehabilitation tool.</p>
          <p className="text-[19px] leading-[28px]">
            Do not attempt any exercises without a formal recommendation from your healthcare provider.
            If you experience sharp pain, dizziness, or shortness of breath, stop immediately and call <strong>111</strong>.
          </p>
          <p className="text-[16px] leading-[24px] text-on-surface-variant">In an emergency, always call <strong>999</strong>.</p>
        </div>
      </div>
    </section>
  )
}

// ── CTA ───────────────────────────────────────────────────────────────────────

export function CTASection() {
  return (
    <section className="text-center py-[60px] bg-surface-container border-2 border-outline-variant" aria-labelledby="cta-heading">
      <h2 id="cta-heading" className="font-bold text-[36px] leading-[44px] mb-[20px]">
        Ready to start your journey?
      </h2>
      <p className="text-[19px] leading-[28px] mb-[40px] max-w-[600px] mx-auto text-on-surface-variant">
        Speak with your NHS clinician about using MoveMend for your recovery plan today.
      </p>
      <Link href={ROUTES.dashboard} className="gds-btn-primary">
        Go to your dashboard
      </Link>
    </section>
  )
}

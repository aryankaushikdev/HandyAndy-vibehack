import Link from 'next/link'
import { ROUTES } from '@/lib/constants'

const BENEFITS = [
  { icon: 'wrist', title: 'Personalised 3D exercises', description: 'Your clinician\'s notes are turned into a specific 3D hand model showing exactly which joints to move and how far.' },
  { icon: 'videocam', title: 'Camera-guided form coaching', description: 'The Gesture Coach watches you exercise via your phone camera and gives live form feedback — no wearable needed.' },
  { icon: 'psychology', title: 'AI safety scanning', description: 'HandyAndy\'s AI flags red-flag symptoms in your clinical notes before analysis and directs you to your clinician immediately.' },
]

export function BenefitsSection() {
  return (
    <section className="mb-[60px]" id="benefits" aria-labelledby="benefits-heading">
      <h2 id="benefits-heading" className="font-bold text-[36px] leading-[44px] mb-[40px] border-b-4 border-nhs-blue inline-block pb-2">
        Better hand recovery for NHS patients
      </h2>
      <div className="grid md:grid-cols-3 gap-[30px]">
        {BENEFITS.map((b) => (
          <div key={b.title} className="bg-surface-container-low p-[20px] border-b-4 border-nhs-blue">
            <span className="material-symbols-outlined text-nhs-blue mb-[10px] block" style={{ fontSize: '40px' }} aria-hidden="true">{b.icon}</span>
            <h3 className="font-bold text-[24px] leading-[32px] mb-2">{b.title}</h3>
            <p className="text-[16px] leading-[24px] text-on-surface-variant">{b.description}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 text-right"><Link href="/benefits" className="gds-link font-bold">See all benefits →</Link></div>
    </section>
  )
}

const STEPS = [
  { number: '01', title: 'Clinician uploads your notes', description: 'After your assessment, your physiotherapist enters your diagnosis and prescribed exercises into HandyAndy.' },
  { number: '02', title: 'AI generates your 3D guide', description: 'HandyAndy\'s AI extracts the specific joints and movements from your clinical notes and loads a 3D hand model showing exactly what to do.' },
  { number: '03', title: 'Camera coaches your form', description: 'Open the Gesture Coach on your phone. It watches your thumb and fingers in real time, scores each movement and speaks to you as you exercise.' },
  { number: '04', title: 'Progress feeds back to your clinician', description: 'Session scores, pain logs and range-of-motion data flow back to your clinician\'s dashboard so they can adjust your plan between appointments.' },
]

export function HowItWorksSection() {
  return (
    <section className="mb-[60px] bg-nhs-blue text-nhs-white p-[40px]" id="how-it-works" aria-labelledby="how-heading">
      <h2 id="how-heading" className="font-bold text-[36px] leading-[44px] mb-[40px] text-nhs-white">How HandyAndy works</h2>
      <div className="space-y-[20px]">
        {STEPS.map((step) => (
          <div key={step.number} className="flex items-start gap-[30px] p-[20px] bg-white/10 border-l-8 border-nhs-focus-yellow">
            <span className="font-bold text-nhs-white opacity-40 flex-shrink-0 select-none" style={{ fontSize: '48px', lineHeight: '56px' }} aria-hidden="true">{step.number}</span>
            <div>
              <h3 className="font-bold text-[24px] leading-[32px] text-nhs-white mb-2">{step.title}</h3>
              <p className="text-[19px] leading-[28px] text-nhs-white opacity-90">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6"><Link href="/how-it-works" className="gds-btn-secondary inline-flex">Read the full guide</Link></div>
    </section>
  )
}

export function SafetySection() {
  return (
    <section className="mb-[60px]" id="safety" aria-labelledby="safety-heading">
      <div className="border-4 border-nhs-error p-[40px]">
        <div className="flex items-center gap-4 mb-[20px]">
          <span className="material-symbols-outlined text-nhs-error flex-shrink-0" style={{ fontSize: '40px' }} aria-hidden="true">report_problem</span>
          <h2 id="safety-heading" className="font-bold text-[36px] leading-[44px] text-nhs-error">Medical Disclaimer</h2>
        </div>
        <div className="space-y-4 max-w-[800px]">
          <p className="font-bold text-[19px] leading-[28px]">HandyAndy is a clinician-prescribed rehabilitation support tool.</p>
          <p className="text-[19px] leading-[28px]">Do not attempt any exercises without a formal recommendation from your healthcare provider. If you experience sharp pain, numbness, sudden swelling, or any other unexpected symptom, stop immediately and call <strong>111</strong>.</p>
          <p className="text-[16px] leading-[24px] text-on-surface-variant">In an emergency, always call <strong>999</strong>.</p>
        </div>
        <div className="mt-4"><Link href="/safety" className="gds-link font-bold">Read our full safety guidance →</Link></div>
      </div>
    </section>
  )
}

export function CTASection() {
  return (
    <section className="text-center py-[60px] bg-surface-container border-2 border-outline-variant" aria-labelledby="cta-heading">
      <h2 id="cta-heading" className="font-bold text-[36px] leading-[44px] mb-[20px]">Ready to start your recovery?</h2>
      <p className="text-[19px] leading-[28px] mb-[40px] max-w-[600px] mx-auto text-on-surface-variant">
        Ask your NHS clinician about HandyAndy — or access your existing dashboard now.
      </p>
      <Link href={ROUTES.dashboard} className="gds-btn-primary">Go to your dashboard</Link>
    </section>
  )
}

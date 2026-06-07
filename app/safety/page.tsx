import type { Metadata } from 'next'
import Link from 'next/link'
import NHSHeader from '@/components/ui/NHSHeader'
import PhaseBanner from '@/components/ui/PhaseBanner'
import NHSFooter from '@/components/ui/NHSFooter'

export const metadata: Metadata = { title: 'Safety Information | HandyAndy' }

const RED_FLAGS = [
  'Numbness or loss of sensation in any finger', 'Fingers turning blue, black, or cold',
  'Sudden severe pain that is different from usual', 'You cannot move a finger at all',
  'Visible deformity or new swelling', 'Signs of infection: pus, fever, rapidly increasing redness',
  'Pins and needles that do not go away', 'Swelling getting significantly worse',
]

const STOP_SIGNS = [
  'Sharp or shooting pain during any movement', 'Pain that worsens significantly after exercise',
  'Unusual swelling after a session', 'Your joint feels unstable or gives way',
  'Skin changes: unusual redness, warmth, or discolouration',
]

export default function SafetyPage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <NHSHeader variant="landing" /><PhaseBanner />
      <main className="flex-1 max-w-[960px] mx-auto px-[15px] py-[60px] w-full" id="main-content">
        <Link href="/" className="gds-link flex items-center gap-1 text-[16px] w-fit mb-[40px]">
          <span className="material-symbols-outlined text-[16px]">arrow_back_ios</span>Back
        </Link>
        <h1 className="font-bold text-[48px] leading-[56px] mb-[10px]">Safety information</h1>
        <p className="text-[19px] leading-[28px] text-on-surface-variant mb-[40px] max-w-[700px]">
          HandyAndy is a clinical support tool — not a replacement for your physiotherapist. Please read this page carefully before using the service.
        </p>

        {/* Emergency */}
        <div className="nhs-warning-callout mb-[40px]">
          <h2 className="font-bold text-[24px] leading-[32px] mb-3 text-nhs-error flex items-center gap-2">
            <span className="material-symbols-outlined text-nhs-error" style={{ fontSize: '28px' }}>emergency</span>
            If you are having a medical emergency
          </h2>
          <p className="text-[19px] leading-[28px] mb-3">Call <strong>999</strong> immediately if you have severe bleeding, loss of consciousness, or are in acute distress.</p>
          <p className="text-[19px] leading-[28px]">For urgent clinical advice that is not a 999 emergency, call <strong>111</strong>.</p>
        </div>

        {/* Medical disclaimer */}
        <div className="bg-white border-2 border-gds-grey-mid border-l-8 border-l-nhs-error p-6 mb-[40px]">
          <h2 className="font-bold text-[24px] leading-[32px] mb-3">Medical disclaimer</h2>
          <p className="text-[19px] leading-[28px] mb-3">HandyAndy is a digital rehabilitation support tool. It is not a regulated medical device under the UK Medical Devices Regulations 2002.</p>
          <p className="text-[19px] leading-[28px] mb-3">The exercise plans, AI analysis, and coaching are based on your clinician&apos;s instructions. HandyAndy does not diagnose, prescribe, or replace professional medical judgement.</p>
          <p className="text-[19px] leading-[28px]"><strong>Only use HandyAndy exercises that have been specifically prescribed to you by an NHS physiotherapist or hand surgeon.</strong></p>
        </div>

        {/* Red flags */}
        <h2 className="font-bold text-[36px] leading-[44px] mb-4">Stop immediately and call your clinician if you notice</h2>
        <p className="text-[19px] leading-[28px] text-on-surface-variant mb-4">These are red-flag symptoms. HandyAndy&apos;s AI automatically scans for these in your clinical notes and will block exercise if any are detected.</p>
        <ul className="bg-white border-2 border-nhs-error mb-[40px]">
          {RED_FLAGS.map((flag, i) => (
            <li key={i} className="flex items-center gap-3 px-4 py-3 border-b border-gds-grey-mid last:border-b-0">
              <span className="material-symbols-outlined material-symbols-filled text-nhs-error flex-shrink-0" style={{ fontSize: '20px' }}>warning</span>
              <span className="text-[16px] leading-[24px]">{flag}</span>
            </li>
          ))}
        </ul>

        {/* Stop signs */}
        <h2 className="font-bold text-[36px] leading-[44px] mb-4">Stop exercising (but not urgently) if</h2>
        <ul className="bg-white border-2 border-gds-grey-mid mb-[40px]">
          {STOP_SIGNS.map((sign, i) => (
            <li key={i} className="flex items-center gap-3 px-4 py-3 border-b border-gds-grey-mid last:border-b-0">
              <span className="material-symbols-outlined text-on-surface-variant flex-shrink-0" style={{ fontSize: '20px' }}>block</span>
              <span className="text-[16px] leading-[24px]">{sign}</span>
            </li>
          ))}
        </ul>

        {/* Who it's for */}
        <h2 className="font-bold text-[36px] leading-[44px] mb-4">Who HandyAndy is for</h2>
        <p className="text-[19px] leading-[28px] text-on-surface-variant mb-4">HandyAndy is designed for adults (18+) with a clinical prescription from an NHS physiotherapist or hand surgeon for hand and wrist rehabilitation.</p>
        <p className="text-[19px] leading-[28px] text-on-surface-variant mb-[40px]">It is not suitable for use without a clinical prescription, for children under 18, or for emergency treatment of acute injuries.</p>

        <div className="flex flex-wrap gap-4">
          <Link href="/support" className="gds-btn-primary">Get support</Link>
          <Link href="/dashboard" className="gds-btn-secondary">Go to dashboard</Link>
        </div>
      </main>
      <NHSFooter />
    </div>
  )
}

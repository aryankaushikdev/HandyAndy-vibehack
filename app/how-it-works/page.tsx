import type { Metadata } from 'next'
import Link from 'next/link'
import NHSHeader from '@/components/ui/NHSHeader'
import PhaseBanner from '@/components/ui/PhaseBanner'
import NHSFooter from '@/components/ui/NHSFooter'

export const metadata: Metadata = { title: 'How HandyAndy Works' }

const STEPS = [
  { icon: 'clinical_notes', title: 'Your clinician enters your prescription', body: 'After your assessment appointment, your physiotherapist or hand surgeon enters your diagnosis, affected joint, and prescribed exercises directly into HandyAndy. You do not need to enter anything yourself.' },
  { icon: 'psychology', title: 'AI extracts your personalised exercise plan', body: "HandyAndy's AI reads your clinical notes and identifies the specific finger joints and movements involved. It cross-references these against a library of validated hand rehabilitation exercises and builds your personalised daily plan." },
  { icon: 'view_in_ar', title: '3D model loads for your specific joint', body: 'A Blender-built 3D hand model loads in the viewer, highlighting exactly the joint your clinician has prescribed exercises for. Ligament, nerve, and muscle overlays can be toggled to help you understand your anatomy.' },
  { icon: 'videocam', title: 'Gesture Coach coaches you in real time', body: 'Open HandyAndy on your phone. The Gesture Coach uses Google MediaPipe — running entirely on your device — to watch your thumb and fingers. It scores every movement (0–10) for reach, hold time, joint shape, and technique, and speaks coaching cues as you exercise.' },
  { icon: 'monitoring', title: 'Progress data feeds back to your clinician', body: 'Session scores, pain log entries, and range-of-motion trends are visible to your clinician between appointments. They can adjust your plan, add new exercises, or flag concerns without waiting for your next visit.' },
]

const TECH = [
  { label: 'Hand tracking',   detail: 'Google MediaPipe — on-device, no video upload' },
  { label: 'AI analysis',     detail: 'Google Gemini 2.5 Flash-Lite — clinical note parsing' },
  { label: '3D visualisation',detail: 'Three.js + Blender GLB — animated hand model' },
  { label: 'Design',          detail: 'NHS GDS — WCAG 2.2 AA accessible' },
  { label: 'Data storage',    detail: 'Session history stored locally on your device only' },
]

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <NHSHeader variant="landing" /><PhaseBanner />
      <main className="flex-1" id="main-content">
        {/* Hero */}
        <div className="bg-nhs-blue py-[60px]">
          <div className="max-w-[960px] mx-auto px-[15px]">
            <Link href="/" className="text-nhs-white opacity-75 hover:opacity-100 flex items-center gap-1 text-[16px] mb-6">
              <span className="material-symbols-outlined text-[16px]">arrow_back_ios</span>Back to home
            </Link>
            <h1 className="font-bold text-nhs-white mb-4" style={{ fontSize: 'clamp(32px, 5vw, 48px)', lineHeight: '1.15' }}>How HandyAndy works</h1>
            <p className="text-[19px] leading-[28px] text-nhs-white opacity-90 max-w-[700px]">
              HandyAndy combines NHS clinical expertise, AI analysis, 3D visualisation, and phone-camera hand tracking into one seamless rehabilitation workflow.
            </p>
          </div>
        </div>

        <div className="max-w-[960px] mx-auto px-[15px] py-[60px]">
          {/* Steps */}
          <h2 className="font-bold text-[36px] leading-[44px] mb-[40px]">The five steps</h2>
          <div className="space-y-[30px] mb-[60px]">
            {STEPS.map((step, i) => (
              <div key={i} className="flex gap-6 p-6 bg-white border-2 border-gds-grey-mid border-l-8 border-l-nhs-blue">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-nhs-blue flex items-center justify-center">
                    <span className="text-white font-bold text-[18px]">{i + 1}</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="material-symbols-outlined material-symbols-filled text-nhs-blue" style={{ fontSize: '24px' }}>{step.icon}</span>
                    <h3 className="font-bold text-[20px] leading-[28px]">{step.title}</h3>
                  </div>
                  <p className="text-[16px] leading-[24px] text-on-surface-variant">{step.body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Technology */}
          <h2 className="font-bold text-[36px] leading-[44px] mb-[20px]">The technology</h2>
          <p className="text-[19px] leading-[28px] text-on-surface-variant mb-6">HandyAndy is built on open, proven technologies with patient privacy at its core.</p>
          <div className="bg-white border-2 border-gds-grey-mid mb-[60px]">
            {TECH.map(({ label, detail }, i) => (
              <div key={i} className="flex gap-4 p-4 border-b border-gds-grey-mid last:border-b-0">
                <span className="font-bold text-[16px] w-40 flex-shrink-0">{label}</span>
                <span className="text-[16px] text-on-surface-variant">{detail}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4">
            <Link href="/dashboard" className="gds-btn-primary">Go to your dashboard</Link>
            <Link href="/benefits" className="gds-btn-secondary">See the benefits</Link>
          </div>
        </div>
      </main>
      <NHSFooter />
    </div>
  )
}

'use client'
import { useState } from 'react'
import Link from 'next/link'
import NHSHeader from '@/components/ui/NHSHeader'
import PhaseBanner from '@/components/ui/PhaseBanner'
import NHSFooter from '@/components/ui/NHSFooter'

export default function FeedbackPage() {
  const [submitted, setSub] = useState(false)
  const [satisfaction, setSat] = useState<string | null>(null)
  const [what, setWhat] = useState('')
  const [improve, setImprove] = useState('')
  const [contact, setContact] = useState(false)

  if (submitted) return (
    <div className="min-h-screen bg-surface flex flex-col">
      <NHSHeader variant="landing" /><PhaseBanner />
      <main className="flex-1 max-w-[960px] mx-auto px-[15px] py-[60px] w-full">
        <div className="border-l-4 border-nhs-green p-6 bg-white border border-gds-grey-mid max-w-[600px]">
          <div className="flex items-center gap-3 mb-3">
            <span className="material-symbols-outlined material-symbols-filled text-nhs-green" style={{ fontSize: '32px' }}>check_circle</span>
            <h1 className="font-bold text-[24px] leading-[32px]">Thank you for your feedback</h1>
          </div>
          <p className="text-[19px] leading-[28px] text-on-surface-variant mb-4">Your feedback helps us improve HandyAndy for all NHS patients. We read every response.</p>
          <Link href="/" className="gds-link font-bold">Return to home</Link>
        </div>
      </main>
      <NHSFooter />
    </div>
  )

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <NHSHeader variant="landing" /><PhaseBanner />
      <main className="flex-1 max-w-[960px] mx-auto px-[15px] py-[60px] w-full" id="main-content">
        <Link href="/" className="gds-link flex items-center gap-1 text-[16px] w-fit mb-[40px]">
          <span className="material-symbols-outlined text-[16px]">arrow_back_ios</span>Back
        </Link>
        <h1 className="font-bold text-[48px] leading-[56px] mb-[10px]">Give feedback on HandyAndy</h1>
        <p className="text-[19px] leading-[28px] text-on-surface-variant mb-[40px]">Help us improve HandyAndy for all NHS patients. This takes about 3 minutes.</p>

        <div className="max-w-[640px] space-y-[40px]">
          <fieldset>
            <legend className="font-bold text-[19px] leading-[28px] mb-4">Overall, how easy was it to use HandyAndy?</legend>
            <div className="space-y-3">
              {['Very easy','Easy','Neither easy nor difficult','Difficult','Very difficult'].map((opt) => (
                <label key={opt} className="flex items-center gap-3 cursor-pointer">
                  <div className={`w-[44px] h-[44px] rounded-full border-3 flex items-center justify-center flex-shrink-0 cursor-pointer ${satisfaction === opt ? 'bg-nhs-blue border-nhs-blue' : 'bg-white border-gds-black'}`}
                    style={{ border: '3px solid', borderColor: satisfaction === opt ? '#005EB8' : '#0B0C0C' }}
                    onClick={() => setSat(opt)} role="radio" aria-checked={satisfaction === opt} tabIndex={0}>
                    {satisfaction === opt && <span className="material-symbols-outlined material-symbols-filled text-white text-[20px]">check</span>}
                  </div>
                  <span className="text-[19px] leading-[28px]" onClick={() => setSat(opt)}>{opt}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div>
            <label className="font-bold text-[19px] leading-[28px] block mb-2" htmlFor="what-worked">What worked well? (optional)</label>
            <p className="text-[16px] leading-[24px] text-on-surface-variant mb-2">Tell us about anything that helped your recovery or was easy to use.</p>
            <textarea id="what-worked" className="gds-textarea" rows={4} placeholder="e.g. The 3D hand model was very clear and easy to follow…"
              value={what} onChange={(e) => setWhat(e.target.value)} maxLength={1200} />
            <p className="text-[14px] text-on-surface-variant mt-1">{what.length}/1200</p>
          </div>

          <div>
            <label className="font-bold text-[19px] leading-[28px] block mb-2" htmlFor="improve">What could we improve? (optional)</label>
            <p className="text-[16px] leading-[24px] text-on-surface-variant mb-2">Tell us about anything that was confusing, missing, or could work better.</p>
            <textarea id="improve" className="gds-textarea" rows={4} placeholder="e.g. I found it hard to position my phone for the camera…"
              value={improve} onChange={(e) => setImprove(e.target.value)} maxLength={1200} />
            <p className="text-[14px] text-on-surface-variant mt-1">{improve.length}/1200</p>
          </div>

          <div>
            <p className="font-bold text-[19px] leading-[28px] mb-3">Can we contact you about your feedback?</p>
            <p className="text-[16px] leading-[24px] text-on-surface-variant mb-3">We may want to follow up. We will never share your details.</p>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="gds-checkbox" style={{ width: '44px', height: '44px', minWidth: '44px' }}
                checked={contact} onChange={(e) => setContact(e.target.checked)} />
              <span className="text-[19px] leading-[28px]">Yes, you can contact me about my feedback</span>
            </label>
          </div>

          <button className="gds-btn-primary" onClick={() => setSub(true)} disabled={!satisfaction}>
            <span className="material-symbols-outlined text-[20px]">send</span>Send feedback
          </button>
          <p className="text-[16px] leading-[24px] text-on-surface-variant">Your feedback is anonymous unless you choose to be contacted.</p>
        </div>
      </main>
      <NHSFooter />
    </div>
  )
}

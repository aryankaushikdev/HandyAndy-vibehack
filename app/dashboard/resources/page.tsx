import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Resources | HandyAndy' }

const EXERCISES = [
  { id: 'e1', name: 'Wrist Extension', level: 'Foundation', duration: '3 × 10 reps', desc: 'Core wrist mobility exercise. Extend slowly upward, hold 2 seconds, return under control.' },
  { id: 'e2', name: 'Finger Flexion', level: 'Foundation', duration: '3 × 15 reps', desc: 'Curl fingers into a full fist, hold 1 second, fully extend.' },
  { id: 'e3', name: 'Open / Close Hand', level: 'Foundation', duration: '3 × 10 reps', desc: 'Full MCP flexion and extension. Improves global hand mobility.' },
  { id: 'e4', name: 'Thumb Opposition (Kapandji)', level: 'Intermediate', duration: '10 reps × 3 sessions', desc: 'Touch thumb tip to each fingertip in turn. Guided by the Gesture Coach camera.' },
  { id: 'e5', name: 'Hook Fist', level: 'Intermediate', duration: '3 × 10 reps', desc: 'Bend PIP and DIP joints keeping MCP straight. Isolates mid-finger joints.' },
  { id: 'e6', name: 'Grip Strength Squeeze', level: 'Strengthening', duration: '3 × 30 sec', desc: 'Squeeze therapy putty or soft ball. Targets intrinsic hand muscles.' },
]

const GUIDES = [
  { icon: 'description', title: 'NHS Hand Therapy Patient Information', sub: 'Royal College of Occupational Therapists', href: 'https://www.rcot.co.uk' },
  { icon: 'description', title: 'Wrist Fracture Rehabilitation Guide', sub: 'NHS Patient Leaflet', href: '#' },
  { icon: 'description', title: 'Managing Pain During Hand Rehab', sub: 'NHS Pain Management Resources', href: 'https://www.nhs.uk/conditions/pain' },
  { icon: 'play_circle', title: 'Hand and Wrist Exercise Technique Videos', sub: 'NHS YouTube Channel', href: '#' },
]

export default function ResourcesPage() {
  return (
    <main className="px-[15px] py-[40px] max-w-[900px] mx-auto" id="main-content">
      <Link href="/dashboard" className="gds-link flex items-center gap-1 text-[16px] w-fit mb-[30px]">
        <span className="material-symbols-outlined text-[16px]">arrow_back_ios</span>Back to dashboard
      </Link>
      <h1 className="font-bold text-[42px] leading-[50px] mb-[10px]">Resources</h1>
      <p className="text-[19px] leading-[28px] text-on-surface-variant mb-[40px]">Exercise library, NHS guides, and patient education materials.</p>

      <h2 className="font-bold text-[28px] leading-[36px] mb-4">Exercise library</h2>
      <p className="text-[16px] leading-[24px] text-on-surface-variant mb-4">Only perform exercises that have been specifically prescribed to you by your clinician.</p>
      <div className="grid sm:grid-cols-2 gap-[15px] mb-[50px]">
        {EXERCISES.map(({ id, name, level, duration, desc }) => (
          <div key={id} className="bg-white border-2 border-gds-grey-mid p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-bold text-[16px] leading-[24px]">{name}</h3>
              <span className={`status-tag flex-shrink-0 ${level === 'Foundation' ? 'status-tag-completed' : level === 'Intermediate' ? 'status-tag-progress' : 'status-tag-warning'}`} style={{ fontSize: '11px' }}>{level}</span>
            </div>
            <p className="text-[13px] text-on-surface-variant mb-2">{duration}</p>
            <p className="text-[14px] leading-[20px]">{desc}</p>
          </div>
        ))}
      </div>

      <h2 className="font-bold text-[28px] leading-[36px] mb-4">NHS guides and leaflets</h2>
      <div className="bg-white border-2 border-gds-grey-mid mb-[40px]">
        {GUIDES.map(({ icon, title, sub, href }, i) => (
          <a key={i} href={href} className="flex items-center gap-4 px-4 py-4 border-b border-gds-grey-mid last:border-b-0 hover:bg-gds-grey-light group" target="_blank" rel="noopener noreferrer">
            <span className="material-symbols-outlined material-symbols-filled text-nhs-blue flex-shrink-0" style={{ fontSize: '24px' }}>{icon}</span>
            <div className="flex-1">
              <div className="font-bold text-[16px] leading-[24px] group-hover:underline text-nhs-blue">{title}</div>
              <div className="text-[13px] text-on-surface-variant">{sub}</div>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '18px' }}>open_in_new</span>
          </a>
        ))}
      </div>

      <div className="border-l-4 border-nhs-error p-4 bg-white border border-gds-grey-mid">
        <p className="text-[15px] leading-[22px]"><strong>Remember:</strong> Only use exercises prescribed by your clinician. If any exercise causes sharp, sudden, or worsening pain, stop and contact your physiotherapist or call 111.</p>
      </div>
    </main>
  )
}

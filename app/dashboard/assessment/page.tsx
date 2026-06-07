import type { Metadata } from 'next'
import Link from 'next/link'
import { DEMO_PATIENT } from '@/lib/constants'
import { StatusTag } from '@/components/ui/StatusTag'

export const metadata: Metadata = { title: 'Assessment | HandyAndy' }

const INITIAL = [
  { label: 'Date of initial assessment', value: '18 May 2026' },
  { label: 'Referring clinician', value: `${DEMO_PATIENT.clinician}, ${DEMO_PATIENT.hospital}` },
  { label: 'Diagnosis', value: 'Right wrist — Distal Radius Fracture, post-fixation' },
  { label: 'Surgery', value: 'ORIF (Open Reduction Internal Fixation) — 10 May 2026' },
  { label: 'Dominant hand', value: 'Right' },
  { label: 'Occupation', value: 'Software engineer (keyboard-intensive)' },
]

const ROM = [
  { motion: 'Wrist Flexion',    week1: '28°', week3: '41°', target: '60°' },
  { motion: 'Wrist Extension',  week1: '22°', week3: '35°', target: '55°' },
  { motion: 'Supination',       week1: '45°', week3: '62°', target: '80°' },
  { motion: 'Pronation',        week1: '50°', week3: '71°', target: '80°' },
  { motion: 'Grip strength',    week1: '8 kg', week3: '14 kg', target: '35 kg' },
]

const UPCOMING = [
  { date: `${DEMO_PATIENT.nextReviewDate}, ${DEMO_PATIENT.nextReviewTime}`, type: 'Week 4 progress review', clinician: DEMO_PATIENT.clinician, mode: 'In person' },
  { date: 'Fri 27 Jun, 14:00',  type: 'Week 6 mid-programme check',    clinician: DEMO_PATIENT.clinician, mode: 'Video' },
  { date: 'Mon 6 Jul, 10:00',   type: 'Week 8 discharge assessment',    clinician: DEMO_PATIENT.clinician, mode: 'In person' },
]

export default function AssessmentPage() {
  return (
    <main className="px-[15px] py-[40px] max-w-[900px] mx-auto" id="main-content">
      <Link href="/dashboard" className="gds-link flex items-center gap-1 text-[16px] w-fit mb-[30px]">
        <span className="material-symbols-outlined text-[16px]">arrow_back_ios</span>Back to dashboard
      </Link>
      <h1 className="font-bold text-[42px] leading-[50px] mb-[10px]">Clinical assessment</h1>
      <p className="text-[19px] leading-[28px] text-on-surface-variant mb-[30px]">Your initial assessment findings and progress measurements from {DEMO_PATIENT.hospital}.</p>

      {/* Initial assessment */}
      <h2 className="font-bold text-[28px] leading-[36px] mb-4">Initial assessment</h2>
      <div className="bg-white border-2 border-gds-grey-mid mb-[40px]">
        {INITIAL.map(({ label, value }, i) => (
          <div key={i} className="flex gap-4 px-4 py-3 border-b border-gds-grey-mid last:border-b-0">
            <span className="font-bold text-[15px] w-52 flex-shrink-0">{label}</span>
            <span className="text-[15px] text-on-surface-variant">{value}</span>
          </div>
        ))}
      </div>

      {/* ROM progress table */}
      <h2 className="font-bold text-[28px] leading-[36px] mb-4">Range of motion measurements</h2>
      <div className="overflow-x-auto mb-[40px]">
        <table className="w-full border-2 border-gds-grey-mid bg-white text-[15px]">
          <thead>
            <tr className="bg-nhs-blue text-white">
              <th className="text-left px-4 py-3 font-bold">Motion</th>
              <th className="text-center px-4 py-3 font-bold">Week 1</th>
              <th className="text-center px-4 py-3 font-bold">Week 3 ↑</th>
              <th className="text-center px-4 py-3 font-bold">Target</th>
            </tr>
          </thead>
          <tbody>
            {ROM.map(({ motion, week1, week3, target }, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gds-grey-light'}>
                <td className="font-bold px-4 py-3">{motion}</td>
                <td className="text-center px-4 py-3 text-on-surface-variant">{week1}</td>
                <td className="text-center px-4 py-3 font-bold text-nhs-green">{week3}</td>
                <td className="text-center px-4 py-3 text-on-surface-variant">{target}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Upcoming assessments */}
      <h2 className="font-bold text-[28px] leading-[36px] mb-4">Upcoming assessments</h2>
      <div className="space-y-[15px] mb-[40px]">
        {UPCOMING.map(({ date, type, clinician, mode }, i) => (
          <div key={i} className={`flex items-start gap-4 p-4 bg-white border-2 ${i === 0 ? 'border-nhs-blue' : 'border-gds-grey-mid'}`}>
            <span className="material-symbols-outlined material-symbols-filled text-nhs-blue flex-shrink-0 mt-1" style={{ fontSize: '24px' }}>event</span>
            <div className="flex-1">
              <div className="font-bold text-[16px] leading-[24px]">{type}</div>
              <div className="text-[14px] text-on-surface-variant">{date} &middot; {clinician}</div>
            </div>
            <StatusTag variant={mode === 'In person' ? 'completed' : 'progress'}>{mode}</StatusTag>
          </div>
        ))}
      </div>

      <Link href="/dashboard/messages" className="gds-btn-primary inline-flex">
        <span className="material-symbols-outlined text-[18px]">mail</span>Message your clinician
      </Link>
    </main>
  )
}

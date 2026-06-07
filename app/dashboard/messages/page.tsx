'use client'
import { useState } from 'react'
import Link from 'next/link'
import { DEMO_PATIENT, DEMO_MESSAGE } from '@/lib/constants'

const MESSAGES = [
  { ...DEMO_MESSAGE, id: 'msg-001' },
  {
    id: 'msg-002', from: 'Dr. Sarah Okonkwo', role: 'Physiotherapist, UCLH',
    sentAt: '3 Jun, 11:42', isRead: true,
    content: 'James — I\'ve reviewed your week 2 data. Your pain scores are improving well. Keep up the wrist extensions and let me know if the flexion exercises cause any sharp discomfort.',
  },
  {
    id: 'msg-003', from: 'James Smith (You)', role: 'Patient', sentAt: '3 Jun, 14:05', isRead: true,
    content: 'Thanks Dr. Okonkwo. Flexion is a little stiff in the morning but settles after the first few reps. Pain is usually around 4/10 at the start, down to 2/10 by the end.',
  },
]

export default function MessagesPage() {
  const [composing, setComposing] = useState(false)
  const [draft, setDraft] = useState('')
  const [sent, setSent] = useState(false)
  const unread = MESSAGES.filter((m) => !m.isRead && m.from !== 'James Smith (You)').length

  return (
    <main className="px-[15px] py-[40px] max-w-[900px] mx-auto" id="main-content">
      <Link href="/dashboard" className="gds-link flex items-center gap-1 text-[16px] w-fit mb-[30px]">
        <span className="material-symbols-outlined text-[16px]">arrow_back_ios</span>Back to dashboard
      </Link>
      <div className="flex items-center justify-between mb-[30px] flex-wrap gap-3">
        <div>
          <h1 className="font-bold text-[42px] leading-[50px]">Messages</h1>
          {unread > 0 && <p className="text-[16px] text-on-surface-variant">{unread} unread message{unread !== 1 ? 's' : ''} from {DEMO_PATIENT.clinician}</p>}
        </div>
        <button className="gds-btn-primary" onClick={() => setComposing(!composing)}>
          <span className="material-symbols-outlined text-[18px]">edit</span>New message
        </button>
      </div>

      {/* Compose box */}
      {composing && (
        <div className="bg-white border-2 border-nhs-blue p-5 mb-[30px]">
          <h2 className="font-bold text-[20px] leading-[28px] mb-3">Message to {DEMO_PATIENT.clinician}</h2>
          {sent ? (
            <div className="flex items-center gap-2 text-nhs-green font-bold text-[16px]">
              <span className="material-symbols-outlined material-symbols-filled text-[22px]">check_circle</span>Message sent
            </div>
          ) : (
            <>
              <textarea className="gds-textarea mb-3" rows={4} placeholder="Write your message here…"
                value={draft} onChange={(e) => setDraft(e.target.value)} maxLength={1000} />
              <div className="flex gap-3">
                <button className="gds-btn-primary" disabled={!draft.trim()} onClick={() => setSent(true)}>
                  <span className="material-symbols-outlined text-[18px]">send</span>Send
                </button>
                <button className="gds-btn-secondary" onClick={() => { setComposing(false); setDraft('') }}>Cancel</button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Message thread */}
      <div className="space-y-[15px]">
        {[...MESSAGES].reverse().map((msg) => {
          const isMe = msg.from.includes('(You)')
          return (
            <div key={msg.id} className={`p-5 border-2 ${!msg.isRead ? 'border-nhs-blue bg-white' : 'border-gds-grey-mid bg-surface-container-low'} ${isMe ? 'ml-8' : 'mr-8'}`}>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className={`font-bold text-[15px] ${isMe ? 'text-on-surface' : 'text-nhs-blue'}`}>{msg.from}</span>
                <span className="text-[13px] text-on-surface-variant">{msg.role}</span>
                {!msg.isRead && <span className="status-tag status-tag-progress ml-auto" style={{ fontSize: '11px' }}>New</span>}
                <span className="text-[13px] text-on-surface-variant ml-auto">{msg.sentAt}</span>
              </div>
              <p className="text-[15px] leading-[22px] text-gds-black">&ldquo;{msg.content}&rdquo;</p>
            </div>
          )
        })}
      </div>
    </main>
  )
}

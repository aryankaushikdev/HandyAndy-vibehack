import { DEMO_MESSAGE } from '@/lib/constants'

export default function ClinicianMessage() {
  return (
    <section
      className="border-t-2 border-gds-grey-mid pt-4"
      aria-labelledby="clinician-message-heading"
    >
      <h2
        id="clinician-message-heading"
        className="font-bold text-[24px] leading-[32px] mb-3"
      >
        Message from Clinician
      </h2>

      <div className="bg-white border-2 border-gds-grey-mid border-l-4 border-l-nhs-blue p-4">
        {/* Sender row */}
        <div className="flex items-start gap-3 mb-3">
          {/* Avatar initial */}
          <div
            className="w-10 h-10 bg-nhs-blue flex items-center justify-center text-white font-bold text-[16px] flex-shrink-0"
            aria-hidden="true"
          >
            {DEMO_MESSAGE.from.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-[16px] leading-[24px] text-nhs-blue">
                {DEMO_MESSAGE.from}
              </span>
              {!DEMO_MESSAGE.isRead && (
                <span
                  className="status-tag status-tag-progress"
                  style={{ fontSize: '11px' }}
                  aria-label="Unread message"
                >
                  New
                </span>
              )}
            </div>
            <div className="text-[13px] leading-[18px] text-on-surface-variant">
              {DEMO_MESSAGE.role} &middot; {DEMO_MESSAGE.sentAt}
            </div>
          </div>
        </div>

        {/* Message content */}
        <blockquote className="text-[16px] leading-[24px] text-gds-black border-l-2 border-gds-grey-mid pl-3 italic">
          &ldquo;{DEMO_MESSAGE.content}&rdquo;
        </blockquote>
      </div>

      {/* Link to messages */}
      <a
        href="#"
        className="gds-link text-[16px] leading-[24px] font-bold mt-3 inline-block"
        aria-label="View all messages, 2 unread"
      >
        View all messages (2 unread) →
      </a>
    </section>
  )
}

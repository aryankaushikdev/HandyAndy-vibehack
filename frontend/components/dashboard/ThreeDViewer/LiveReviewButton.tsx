interface LiveReviewButtonProps {
  href: string
}

export default function LiveReviewButton({ href }: LiveReviewButtonProps) {
  return (
    <a
      href={href}
      className="gds-btn-live-review"
      aria-label="Join your scheduled live review session with your physiotherapist"
    >
      <span
        className="material-symbols-outlined material-symbols-filled flex-shrink-0"
        style={{ fontSize: '22px' }}
        aria-hidden="true"
      >
        video_call
      </span>
      Join Live Review Session
      <span
        className="material-symbols-outlined flex-shrink-0 ml-auto"
        style={{ fontSize: '20px' }}
        aria-hidden="true"
      >
        arrow_forward
      </span>
    </a>
  )
}

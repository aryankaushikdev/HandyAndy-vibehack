interface PhaseBannerProps {
  className?: string
}

export default function PhaseBanner({ className = '' }: PhaseBannerProps) {
  return (
    <div className={`gds-phase-banner ${className}`}>
      <span className="beta-tag" aria-label="Beta service">BETA</span>
      <p className="text-[16px] leading-[24px]">
        This is a new service – your{' '}
        <a href="#" className="gds-link">
          feedback
        </a>{' '}
        will help us to improve it.
      </p>
    </div>
  )
}

import Link from 'next/link'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import type { ButtonVariant } from '@/lib/types'

interface GDSButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  href?: string
  children: ReactNode
  fullWidth?: boolean
  icon?: string
  iconPosition?: 'left' | 'right'
  external?: boolean
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:       'gds-btn-primary',
  blue:          'gds-btn-blue',
  secondary:     'gds-btn-secondary',
  warning:       'gds-btn-warning',
  'live-review': 'gds-btn-live-review',
}

export default function GDSButton({
  variant = 'primary',
  href,
  children,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  external = false,
  className = '',
  disabled,
  ...props
}: GDSButtonProps) {
  const base = VARIANT_CLASSES[variant]
  const classes = [
    base,
    fullWidth ? 'w-full justify-center' : '',
    disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const iconEl = (name: string) => (
    <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
      {name}
    </span>
  )

  const content = (
    <>
      {icon && iconPosition === 'left'  && iconEl(icon)}
      {children}
      {icon && iconPosition === 'right' && iconEl(icon)}
    </>
  )

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {content}
      </Link>
    )
  }

  return (
    <button className={classes} disabled={disabled} {...props}>
      {content}
    </button>
  )
}

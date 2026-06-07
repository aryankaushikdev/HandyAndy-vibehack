const FOOTER_LINKS = [
  { label: 'Accessibility statement', href: '#' },
  { label: 'Cookies',                 href: '#' },
  { label: 'Privacy policy',          href: '#' },
  { label: 'Terms and conditions',    href: '#' },
  { label: 'Contact us',              href: '#' },
]

interface NHSFooterProps {
  withSidebarOffset?: boolean
}

export default function NHSFooter({ withSidebarOffset = false }: NHSFooterProps) {
  return (
    <footer
      className="w-full px-[15px] py-[40px] bg-gds-grey-light border-t-2 border-gds-grey-mid"
      aria-label="Site footer"
    >
      <div className={`max-w-[960px] mx-auto ${withSidebarOffset ? 'lg:ml-64' : ''}`}>
        <div className="font-bold text-[16px] leading-[24px] text-gds-black mb-4">
          MoveMend
        </div>
        <nav
          className="flex flex-wrap gap-x-8 gap-y-2 mb-6"
          aria-label="Footer navigation"
        >
          {FOOTER_LINKS.map((link) => (
            <a key={link.label} href={link.href} className="gds-link text-[16px] leading-[24px]">
              {link.label}
            </a>
          ))}
        </nav>
        <p className="text-[16px] leading-[24px] text-gds-black">
          © MoveMend Healthcare. Part of the NHS Digital ecosystem.
        </p>
      </div>
    </footer>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Clerk NHS GDS Appearance Configuration
// Shared between sign-in and sign-up pages.
// Applies NHS/GDS visual standards to Clerk's pre-built auth components.
// ─────────────────────────────────────────────────────────────────────────────

export const NHS_CLERK_APPEARANCE = {
  variables: {
    colorPrimary:          '#005EB8',   // NHS Blue
    colorBackground:       '#ffffff',
    colorText:             '#0B0C0C',   // GDS Black
    colorInputText:        '#0B0C0C',
    colorInputBackground:  '#ffffff',
    colorDanger:           '#D4351C',   // NHS Error Red
    fontFamily:            '"Atkinson Hyperlegible Next", Helvetica Neue, Arial, sans-serif',
    fontSize:              '16px',
    borderRadius:          '0px',       // GDS square corners
    spacingUnit:           '5px',
  },
  elements: {
    // Card — GDS flat style: no shadow, solid border
    card:
      'shadow-none border-2 border-gds-grey-mid rounded-none p-0 bg-white',
    cardBox:
      'shadow-none',

    // Header
    headerTitle:
      'font-bold text-gds-black',
    headerSubtitle:
      'text-on-surface-variant',

    // Social login buttons (Google etc.)
    socialButtonsBlockButton:
      'border-2 border-gds-grey-mid rounded-none font-bold hover:bg-gds-grey-light transition-colors',
    socialButtonsBlockButtonText:
      'font-bold text-gds-black text-[16px]',

    // Divider
    dividerLine:    'bg-gds-grey-mid',
    dividerText:    'text-on-surface-variant text-[14px]',

    // Form fields
    formFieldLabel:
      'font-bold text-gds-black text-[16px] leading-[24px] mb-1 block',
    formFieldInput:
      'border-2 border-gds-black rounded-none text-[16px] leading-[24px] px-[10px] py-[8px] w-full bg-white text-gds-black focus:outline-none focus:ring-3 focus:ring-nhs-focus-yellow',
    formFieldErrorText:
      'text-nhs-error text-[14px] font-bold mt-1',
    formFieldSuccessText:
      'text-nhs-green text-[14px] font-bold mt-1',

    // Primary button — GDS Green with bottom shadow
    formButtonPrimary:
      'gds-btn-primary w-full justify-center text-[16px] rounded-none',

    // Footer links
    footerAction:
      'text-[16px] leading-[24px]',
    footerActionLink:
      'text-nhs-blue font-bold underline underline-offset-2 hover:text-primary',

    // Identity preview (after Google SSO)
    identityPreviewText:
      'text-gds-black text-[16px]',
    identityPreviewEditButton:
      'text-nhs-blue font-bold underline',

    // Alert
    alert:
      'border-l-4 border-nhs-error bg-error-container text-on-error-container p-3 text-[16px]',
    alertText:
      'text-gds-black text-[16px]',
  },
}

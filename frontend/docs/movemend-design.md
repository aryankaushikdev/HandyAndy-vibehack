---
name: MoveMend
colors:
  surface: '#f6fafb'
  surface-dim: '#d6dbdc'
  surface-bright: '#f6fafb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f4f5'
  surface-container: '#eaeef0'
  surface-container-high: '#e5e9ea'
  surface-container-highest: '#dfe3e4'
  on-surface: '#181c1d'
  on-surface-variant: '#424752'
  inverse-surface: '#2c3132'
  inverse-on-surface: '#edf1f2'
  outline: '#727783'
  outline-variant: '#c2c6d4'
  surface-tint: '#005db6'
  primary: '#00478d'
  on-primary: '#ffffff'
  primary-container: '#005eb8'
  on-primary-container: '#c8daff'
  inverse-primary: '#a9c7ff'
  secondary: '#006e28'
  on-secondary: '#ffffff'
  secondary-container: '#82fc90'
  on-secondary-container: '#00752a'
  tertiary: '#950001'
  on-tertiary: '#ffffff'
  tertiary-container: '#bf100a'
  on-tertiary-container: '#ffcfc7'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#a9c7ff'
  on-primary-fixed: '#001b3d'
  on-primary-fixed-variant: '#00468c'
  secondary-fixed: '#82fc90'
  secondary-fixed-dim: '#65df77'
  on-secondary-fixed: '#002107'
  on-secondary-fixed-variant: '#00531c'
  tertiary-fixed: '#ffdad4'
  tertiary-fixed-dim: '#ffb4a8'
  on-tertiary-fixed: '#410000'
  on-tertiary-fixed-variant: '#930001'
  background: '#f6fafb'
  on-background: '#181c1d'
  surface-variant: '#dfe3e4'
typography:
  headline-xl:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-md:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 19px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 40px
  xl: 64px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
  max-width: 1200px
---

## Brand & Style
The brand personality is authoritative, dependable, and clinical yet compassionate. This design system is built for a healthcare environment where clarity of information is the highest priority. The target audience includes patients managing recovery and clinicians monitoring progress, requiring an interface that minimizes cognitive load and maximizes accessibility.

The style is **Corporate / Modern** with a strong emphasis on **Accessibility**. It follows a "content-first" philosophy, utilizing high-contrast ratios, generous white space, and a systematic hierarchy. It avoids decorative flourishes, focusing instead on utilitarian beauty derived from structure and legibility.

## Colors
The palette is rooted in the trusted NHS visual identity to evoke immediate professional credibility.

- **Primary (#005EB8):** Used for core branding, primary actions, and navigational wayfinding.
- **Success (#009639):** Reserved for "happy paths," recovery milestones, and positive health indicators.
- **Alert (#DA291C):** Used sparingly for urgent red flags, contraindications, or errors.
- **Surface Strategy:** Backgrounds are pure white (#FFFFFF) to maintain a sterile, clean feel. Containers and grouping elements use the Light Grey (#F0F4F5) to provide subtle structural contrast without the need for heavy shadows.

## Typography
The typography system prioritizes hyper-legibility. **Atkinson Hyperlegible Next** is used for headlines to ensure distinctive character shapes, which is critical for users with visual impairments. **Inter** is used for body and UI elements due to its neutral, systematic nature and excellent performance at small sizes.

Line heights are intentionally generous to improve tracking for users with cognitive fatigue. Headlines use a slight negative letter spacing for better visual grouping at large scales.

## Layout & Spacing
This design system employs a **Fixed Grid** model for desktop to ensure readability is maintained within a comfortable eye-span, while utilizing a **Fluid Grid** for mobile devices.

- **Desktop:** 12-column grid, 1200px max-width, 24px gutters.
- **Mobile:** 4-column grid, 16px margins.
- **Rhythm:** An 8px base unit drives all spatial relationships. Vertical rhythm is strictly enforced to create a sense of order and calm, which is essential in medical applications.

## Elevation & Depth
In alignment with the need for high contrast and accessibility, depth is conveyed through **Tonal Layers** and **Low-contrast Outlines** rather than complex shadows.

- **Level 0:** Main page background (#FFFFFF).
- **Level 1:** Content cards and containers using the neutral fill (#F0F4F5).
- **Level 2:** Active or interactive elements use a 2px solid border (#E8EDEE) for definition.
- **Shadows:** Avoided for decorative purposes. A single, high-diffusion "Safety Shadow" (0px 4px 12px rgba(0, 0, 0, 0.05)) is used only for temporary floating elements like modals or dropdowns to ensure they sit clearly above the page context.

## Shapes
Shapes are friendly yet professional. A consistent 8px (0.5rem) corner radius is applied to all primary containers, buttons, and input fields. This softens the clinical feel of the app while remaining structured enough to feel "official."

Interactive elements like Checkboxes and Radio buttons follow standard conventions (square and circle respectively) but utilize the 8px radius for Checkboxes to maintain system harmony.

## Components
- **Buttons:** Primary buttons are solid NHS Blue with white text. Secondary buttons are outlined in NHS Blue with a 2px stroke. Buttons must have a minimum height of 48px to meet touch-target accessibility standards.
- **Chips:** Used for health status or categories. They use a light tint of the status color (e.g., Light Green background for "Completed") with dark text to ensure contrast ratios exceed 4.5:1.
- **Input Fields:** Large, clear tap targets with a 2px border. Labels are always visible (never placeholder-only) to ensure users don't lose context.
- **Cards:** Used for exercise instructions or patient data. They feature a 1px border (#E8EDEE) and use a white background to stand out against the light grey page containers.
- **Alerts:** Full-width banners at the top of content areas. Red alerts use a thick 4px left-border of NHS Red to catch attention immediately without overwhelming the screen with red.
- **Progress Indicators:** Linear bars using NHS Green to visualize recovery progress, providing clear, rewarding feedback for the user.
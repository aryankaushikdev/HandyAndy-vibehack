---
name: MoveMend Health Design System
colors:
  surface: '#f9f9ff'
  surface-dim: '#d8dae2'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3fb'
  surface-container: '#ecedf6'
  surface-container-high: '#e7e8f0'
  surface-container-highest: '#e1e2ea'
  on-surface: '#191c21'
  on-surface-variant: '#424752'
  inverse-surface: '#2e3037'
  inverse-on-surface: '#eff0f8'
  outline: '#727783'
  outline-variant: '#c2c6d4'
  surface-tint: '#005db6'
  primary: '#00478d'
  on-primary: '#ffffff'
  primary-container: '#005eb8'
  on-primary-container: '#c8daff'
  inverse-primary: '#a9c7ff'
  secondary: '#006d3a'
  on-secondary: '#ffffff'
  secondary-container: '#97f3b2'
  on-secondary-container: '#04723d'
  tertiary: '#793100'
  on-tertiary: '#ffffff'
  tertiary-container: '#9f4300'
  on-tertiary-container: '#ffcfb9'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#a9c7ff'
  on-primary-fixed: '#001b3d'
  on-primary-fixed-variant: '#00468c'
  secondary-fixed: '#9af6b5'
  secondary-fixed-dim: '#7eda9a'
  on-secondary-fixed: '#00210e'
  on-secondary-fixed-variant: '#00522a'
  tertiary-fixed: '#ffdbcb'
  tertiary-fixed-dim: '#ffb691'
  on-tertiary-fixed: '#341100'
  on-tertiary-fixed-variant: '#793100'
  background: '#f9f9ff'
  on-background: '#191c21'
  surface-variant: '#e1e2ea'
  nhs-blue: '#005EB8'
  nhs-white: '#FFFFFF'
  gds-black: '#0B0C0C'
  gds-grey-light: '#F3F2F1'
  gds-grey-mid: '#B1B4B6'
  nhs-error: '#D4351C'
  nhs-focus-yellow: '#FFDD00'
typography:
  headline-xl:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
  headline-xl-mobile:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
  headline-md:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  body-md:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 19px
    fontWeight: '400'
    lineHeight: 28px
  body-sm:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-bold:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 19px
    fontWeight: '700'
    lineHeight: 28px
  caption:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
spacing:
  unit: 5px
  gutter: 30px
  margin-page: 15px
  stack-sm: 10px
  stack-md: 20px
  stack-lg: 40px
  stack-xl: 60px
---

## Brand & Style

The design system is rooted in the principles of the **GOV.UK and NHS Digital Service Manuals**, prioritizing clarity, trust, and universal accessibility. As a medical rehabilitation tool, the brand personality is clinical, authoritative, and dependable. It avoids unnecessary decoration to ensure users—who may be under physical or cognitive stress—can navigate information with minimal friction.

The visual style is **Corporate / Minimalist**, characterized by:
- **Information-First Hierarchy:** Typography and structure communicate priority, not color or effects.
- **Radical Functionalism:** Every element exists for a specific utility; if it doesn't aid the user's task, it is removed.
- **High Trust Visuals:** Utilizes the established "Blue and White" NHS aesthetic to instantly signal medical legitimacy and safety.

## Colors

This design system utilizes the **NHS Digital** palette, dominated by NHS Blue and White to establish a clinical environment.

- **Primary (NHS Blue):** Used for the header, primary branding, and indicating the system's identity. 
- **Interactive (GDS Blue/NHS Blue):** Standard links use a high-contrast blue. 
- **Success (GDS Green):** Specifically for "Success" banners and primary "Complete/Accept" actions.
- **Focus State:** To meet AAA accessibility standards, the focus state must use a high-visibility yellow background with a thick black outline.
- **Neutrals:** Greys are used strictly for structural surfaces (like table headers or cookie banners) and borders, never for primary text.

## Typography

The system uses **Atkinson Hyperlegible Next**, designed specifically for low-vision readers to increase character recognition and reduce misreading.

- **Readability:** All body text is set to a base of 19px on desktop to ensure comfortable reading of medical instructions.
- **Hierarchy:** Clear distinction between H1 (Page Title) and H2 (Section Title) is maintained through significant size differences and bold weights.
- **Line Height:** Generous leading (minimum 1.5x) is applied to all body text to prevent "crowding" of lines, aiding users with cognitive impairments or dyslexia.

## Layout & Spacing

This design system uses a **Fixed Grid** approach for content readability, aligning with the GDS 12-column structure with a max-width of 960px for the main content area.

- **Spacing Rhythm:** Based on a 5px/10px modular increment. Vertical rhythm is strictly enforced to group related content (e.g., a heading and its subsequent paragraph have smaller spacing than the space between two sections).
- **Responsive Behavior:** 
  - **Desktop:** Often utilizes a two-column layout: a 1/3 sidebar for navigation or metadata and a 2/3 main column for the primary task.
  - **Tablet/Mobile:** Content reflows into a single column. Horizontal margins are reduced to 15px.
- **Whitespace:** Use aggressive whitespace between major sections (60px+) to prevent the user from feeling overwhelmed by medical data.

## Elevation & Depth

In accordance with GDS standards, this design system is **strictly flat**. 

- **No Shadows:** Depth is never communicated through shadows. 
- **Tonal Separation:** Use background colors (GDS Light Grey) to define distinct areas like the header, the "Phase Banner," or sidebar navigation.
- **Structural Borders:** Use solid 1px or 2px mid-grey borders to separate table rows, form groups, or sections. 
- **Focus:** The only "elevation" is the logical layer of the cookie banner or modal, which uses a high-contrast border rather than a drop shadow.

## Shapes

The design system uses a **Sharp (0px)** roundedness level. 

- **Authority:** Square corners for buttons, inputs, and containers convey a sense of formal, institutional stability and precision.
- **Borders:** Buttons use a solid bottom border (2px) to provide a tactile sense of "press" without needing gradients or shadows.

## Components

### Header & Phase Banner
- **NHS Header:** A full-width NHS Blue bar containing the white logo and service name.
- **Phase Banner:** Located immediately below the header. A "Beta" tag (white text on a blue background) followed by a link to a feedback survey.

### Buttons
- **Primary:** NHS Blue (or GDS Green for "Start" buttons) with square corners and a dark bottom border.
- **Secondary:** Light grey background with a black border.
- **Warning:** Red background with a white text and a dark red bottom border.

### Input Fields & Controls
- **Text Inputs:** White background, 2px black border, square corners.
- **Checkboxes/Radios:** Large, high-contrast targets (44x44px minimum) to assist users with limited fine motor skills.
- **Error States:** Indicated by a 4px solid red left-border on the container and a red error message above the input.

### Navigation
- **Breadcrumbs:** Simple text links separated by a chevron (`>`) at the top of the main content area.
- **Back Link:** A simple underline link with a back-arrow icon, placed above the page H1.

### Cards & Containers
- **In-Page Nav:** Lists of links styled as simple text blocks with horizontal rules between them.
- **Summary Lists:** Two-column tables with no outer border, used for reviewing information before submission.
import type { Config } from 'tailwindcss'

// ─────────────────────────────────────────────────────────────────────────────
// MoveMend NHS/GDS Design Token System
// Source: movemend/DESIGN.md + movemend_health_design_system/DESIGN.md
// NHS Digital Service Manual: https://service-manual.nhs.uk
// GOV.UK Design System: https://design-system.service.gov.uk
// ─────────────────────────────────────────────────────────────────────────────

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {

      // ── COLOURS ─────────────────────────────────────────────────────────────
      colors: {

        // NHS Core Brand
        'nhs-blue':          '#005EB8',
        'nhs-white':         '#FFFFFF',
        'nhs-green':         '#00703C',
        'nhs-green-dark':    '#002d18',
        'nhs-error':         '#D4351C',
        'nhs-error-dark':    '#55140b',
        'nhs-focus-yellow':  '#FFDD00',

        // GDS Core
        'gds-black':         '#0B0C0C',
        'gds-grey-light':    '#F3F2F1',
        'gds-grey-mid':      '#B1B4B6',

        // Surface System (Material You / NHS adaptation)
        'surface':                    '#f9f9ff',
        'surface-dim':                '#d8dae2',
        'surface-bright':             '#f9f9ff',
        'surface-container-lowest':   '#ffffff',
        'surface-container-low':      '#f2f3fb',
        'surface-container':          '#ecedf6',
        'surface-container-high':     '#e7e8f0',
        'surface-container-highest':  '#e1e2ea',
        'surface-variant':            '#e1e2ea',
        'surface-tint':               '#005db6',

        // On-Surface
        'on-surface':         '#191c21',
        'on-surface-variant': '#424752',
        'background':         '#f9f9ff',
        'on-background':      '#191c21',
        'inverse-surface':    '#2e3037',
        'inverse-on-surface': '#eff0f8',

        // Primary (NHS Blue family)
        'primary':                  '#00478d',
        'on-primary':               '#ffffff',
        'primary-container':        '#005eb8',
        'on-primary-container':     '#c8daff',
        'primary-fixed':            '#d6e3ff',
        'primary-fixed-dim':        '#a9c7ff',
        'on-primary-fixed':         '#001b3d',
        'on-primary-fixed-variant': '#00468c',
        'inverse-primary':          '#a9c7ff',

        // Secondary (NHS Green family)
        'secondary':                  '#006d3a',
        'on-secondary':               '#ffffff',
        'secondary-container':        '#97f3b2',
        'on-secondary-container':     '#04723d',
        'secondary-fixed':            '#9af6b5',
        'secondary-fixed-dim':        '#7eda9a',
        'on-secondary-fixed':         '#00210e',
        'on-secondary-fixed-variant': '#00522a',

        // Tertiary (Alert/Amber family)
        'tertiary':                   '#793100',
        'on-tertiary':                '#ffffff',
        'tertiary-container':         '#9f4300',
        'on-tertiary-container':      '#ffcfb9',
        'tertiary-fixed':             '#ffdbcb',
        'tertiary-fixed-dim':         '#ffb691',
        'on-tertiary-fixed':          '#341100',
        'on-tertiary-fixed-variant':  '#793100',

        // Error
        'error':              '#ba1a1a',
        'on-error':           '#ffffff',
        'error-container':    '#ffdad6',
        'on-error-container': '#93000a',

        // Outline
        'outline':         '#727783',
        'outline-variant': '#c2c6d4',
      },

      // ── TYPOGRAPHY ──────────────────────────────────────────────────────────
      // NHS standard: Atkinson Hyperlegible Next for all text
      // Designed for low-vision readability; distinctive character shapes
      fontFamily: {
        sans:            ['"Atkinson Hyperlegible Next"', 'Helvetica Neue', 'Arial', 'sans-serif'],
        'nhs-display':   ['"Atkinson Hyperlegible Next"', 'sans-serif'],
        'nhs-body':      ['"Atkinson Hyperlegible Next"', 'sans-serif'],
      },

      fontSize: {
        // Headlines — negative letter-spacing for visual grouping at scale
        'headline-xl':        ['48px', { lineHeight: '56px', fontWeight: '700', letterSpacing: '-0.01em' }],
        'headline-xl-mobile': ['32px', { lineHeight: '40px', fontWeight: '700' }],
        'headline-lg':        ['36px', { lineHeight: '44px', fontWeight: '700' }],
        'headline-md':        ['24px', { lineHeight: '32px', fontWeight: '700' }],

        // Body — generous leading for cognitive accessibility
        'body-md':    ['19px', { lineHeight: '28px', fontWeight: '400' }],
        'body-sm':    ['16px', { lineHeight: '24px', fontWeight: '400' }],

        // UI
        'label-bold': ['19px', { lineHeight: '28px', fontWeight: '700' }],
        'caption':    ['14px', { lineHeight: '20px', fontWeight: '400' }],
      },

      // ── SPACING ─────────────────────────────────────────────────────────────
      // NHS GDS: 5px/10px modular increment (not 8px base)
      spacing: {
        'unit':        '5px',   // 1 unit
        'stack-sm':    '10px',  // 2 units
        'stack-md':    '20px',  // 4 units
        'stack-lg':    '40px',  // 8 units
        'stack-xl':    '60px',  // 12 units
        'gutter':      '30px',  // column gutter
        'margin-page': '15px',  // page edge margin
      },

      // ── BORDER RADIUS ───────────────────────────────────────────────────────
      // GDS standard: strictly square (0px) for interactive elements
      // Small radius available for decorative containers only
      borderRadius: {
        'none':    '0px',     // GDS standard — buttons, inputs, cards
        'DEFAULT': '0px',     // default to square
        'sm':      '2px',     // subtle rounding for chips only
        'md':      '4px',     // container softening
        'lg':      '8px',     // large containers (non-interactive)
        'full':    '9999px',  // notification badges, status pips
      },

      // ── MAX WIDTH ───────────────────────────────────────────────────────────
      maxWidth: {
        'content': '960px',  // NHS GDS content column max-width
        'page':    '1200px', // Full page wrapper
      },

      // ── BOX SHADOW ──────────────────────────────────────────────────────────
      // GDS: no decorative shadows; only functional button-press depth
      boxShadow: {
        'nhs-btn':      '0 4px 0 #002d18',    // Green button
        'nhs-btn-blue': '0 4px 0 #001b3d',    // Blue button
        'nhs-btn-red':  '0 4px 0 #55140b',    // Warning button
        'nhs-btn-grey': '0 4px 0 #6f777b',    // Secondary button
        'none':         'none',
      },

      // ── TRANSITIONS ─────────────────────────────────────────────────────────
      transitionDuration: {
        'fast':   '150ms',
        'normal': '200ms',
        'slow':   '300ms',
      },

      // ── ANIMATIONS ──────────────────────────────────────────────────────────
      keyframes: {
        'pulse-live': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%':      { opacity: '0.6', transform: 'scale(1.3)' },
        },
        'spin-ring': {
          'to': { transform: 'rotate(360deg)' },
        },
        'fade-in-up': {
          'from': { opacity: '0', transform: 'translateY(8px)' },
          'to':   { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          'from': { opacity: '0' },
          'to':   { opacity: '1' },
        },
        'slide-in-left': {
          'from': { opacity: '0', transform: 'translateX(-12px)' },
          'to':   { opacity: '1', transform: 'translateX(0)' },
        },
        'progress-grow': {
          'from': { width: '0%' },
          'to':   { width: '100%' },
        },
      },
      animation: {
        'pulse-live':    'pulse-live 1.5s ease-in-out infinite',
        'spin-ring':     'spin-ring 0.8s linear infinite',
        'fade-in-up':    'fade-in-up 0.3s ease-out forwards',
        'fade-in':       'fade-in 0.25s ease-out forwards',
        'slide-in-left': 'slide-in-left 0.25s ease-out forwards',
        'progress-grow': 'progress-grow 0.8s ease-out forwards',
      },
    },
  },
  plugins: [],
}

export default config

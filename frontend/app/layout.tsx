// ─────────────────────────────────────────────────────────────────────────────
// MoveMend — Root Layout (no auth)
// Loads Atkinson Hyperlegible Next typeface + Material Symbols.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default:  'MoveMend | NHS Recovery Platform',
    template: '%s | MoveMend',
  },
  description:
    'Personalised physical rehabilitation guided by clinical expertise. ' +
    'MoveMend connects you with your NHS clinician to ensure every step ' +
    'of your recovery journey is safe and effective.',
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* NHS-mandated accessible typeface — low-vision optimised */}
        <link
          href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Next:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
        {/* Material Symbols — clinical icon set */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface text-on-surface antialiased">
        {children}
      </body>
    </html>
  )
}

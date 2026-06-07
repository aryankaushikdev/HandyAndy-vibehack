import type { Metadata, Viewport } from 'next'
import CookiesBanner from '@/components/ui/CookiesBanner'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'HandyAndy | NHS Hand Rehabilitation', template: '%s | HandyAndy' },
  description: 'AI-powered hand rehabilitation guided by NHS clinical expertise. HandyAndy connects you with your physiotherapist and coaches your exercises in real time.',
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  width: 'device-width', initialScale: 1, maximumScale: 5,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Next:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
      </head>
      <body className="bg-surface text-on-surface antialiased">
        <CookiesBanner />
        {children}
      </body>
    </html>
  )
}

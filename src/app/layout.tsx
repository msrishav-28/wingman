import type { Metadata } from 'next'
import { Space_Grotesk, Manrope, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import Providers from './providers'
import { cn } from '@/lib/utils'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '700'],
})

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500'],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '700'],
})

export const metadata: Metadata = {
  title: 'Student Companion - Tactical HUD',
  description: 'Manage attendance, grades, and academic life with precision.',
  manifest: '/manifest.json',
  themeColor: '#050505',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Student Companion',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark h-full">
      <body className={cn(
        "bg-[#050505] min-h-screen font-body antialiased selection:bg-neon-green/30 selection:text-neon-green",
        spaceGrotesk.variable,
        manrope.variable,
        jetbrainsMono.variable
      )}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}

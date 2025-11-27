import type { Metadata, Viewport } from 'next'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { ServiceWorkerProvider } from '@/components/providers/ServiceWorkerProvider'
import './globals.css'

export const metadata: Metadata = {
  title: 'plynk arc - Draw Your Arcs',
  description: 'AI 기반 자동 정리 지식 관리 도구. 빠른 저장, 자동 AI 정리, Hebbia 스타일 테이블 자동 생성.',
  keywords: ['knowledge management', 'AI', 'productivity', 'note taking', 'research'],
  authors: [{ name: 'plynk' }],
  creator: 'plynk',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'plynk arc',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'plynk arc',
    title: 'plynk arc - Draw Your Arcs',
    description: 'AI 기반 자동 정리 지식 관리 도구',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'plynk arc - Draw Your Arcs',
    description: 'AI 기반 자동 정리 지식 관리 도구',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#111827' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon.svg" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <ServiceWorkerProvider>
            {children}
          </ServiceWorkerProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

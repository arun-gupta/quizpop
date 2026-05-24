import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'QuizPop - Party Quiz Game',
  description: 'Fast, fun multiplayer quiz game for parties and events. Up to 100 players, live scoring, and endless fun!',
  keywords: ['quiz', 'party game', 'multiplayer', 'trivia', 'kahoot', 'live game'],
  authors: [{ name: 'QuizPop' }],
  openGraph: {
    title: 'QuizPop - Party Quiz Game',
    description: 'Fast, fun multiplayer quiz game for parties and events!',
    type: 'website',
    locale: 'en_US',
    siteName: 'QuizPop',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QuizPop - Party Quiz Game',
    description: 'Fast, fun multiplayer quiz game for parties and events!',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
  },
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  themeColor: '#0f0a1e',
  colorScheme: 'dark',
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
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-[#0f0a1e] text-white font-sans antialiased">
        {children}
      </body>
    </html>
  )
}

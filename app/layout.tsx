import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sono Église - Gestion Sonorisation',
  description: 'Application de gestion de sonorisation pour les cultes',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  themeColor: '#0f172a',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className="antialiased">{children}</body>
    </html>
  )
}

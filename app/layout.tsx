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
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}

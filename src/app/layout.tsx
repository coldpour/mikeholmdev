import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import 'leaflet/dist/leaflet.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Mike Holm | Portfolio',
  description:
    'Fast product engineering, front-end systems, and technical foundations for complex software.',
  metadataBase: new URL('https://mikeholmdev.com')
}

type RootLayoutProps = {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <InitColorSchemeScript attribute="data" defaultMode="system" />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

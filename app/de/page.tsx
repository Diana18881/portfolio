import type { Metadata } from 'next'
import HomePage from '../_components/home-page'

export const metadata: Metadata = {
  title: { absolute: 'Diana Tsymbaliuk | Frontend-Entwicklerin' },
  description:
    'Portfolio von Diana Tsymbaliuk, Frontend-Entwicklerin in Berlin: React, Next.js und TypeScript, mit funktionierenden Demo-Projekten.',
  alternates: { canonical: '/de', languages: { en: '/', de: '/de' } },
  openGraph: {
    type: 'website',
    siteName: 'Diana Tsymbaliuk',
    locale: 'de_DE',
    url: '/de',
    images: '/opengraph-image',
  },
}

export default function GermanHome() {
  return <HomePage language="DE" />
}

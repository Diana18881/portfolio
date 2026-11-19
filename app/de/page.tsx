import type { Metadata } from 'next'
import HomePage from '../_components/home-page'

export const metadata: Metadata = {
  title: { absolute: 'Diana Tsymbaliuk | Full-Stack-Entwicklerin' },
  description:
    'Portfolio von Diana Tsymbaliuk, Full-Stack-Entwicklerin in Berlin: React, Next.js, TypeScript, Node.js und SQL, mit funktionierenden Demo-Projekten.',
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

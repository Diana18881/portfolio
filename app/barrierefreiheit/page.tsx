import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Barrierefreiheit',
  description: 'Erklärung zur Barrierefreiheit der Portfolio-Website von Diana Tsymbaliuk.',
  alternates: { canonical: '/barrierefreiheit' },
}

export default function AccessibilityPage() {
  return (
    <main lang="de" className="min-h-screen bg-[#0d0d0d] px-6 py-16 text-white md:px-10">
      <div className="mx-auto max-w-3xl">
        <Link href="/de" className="text-xs font-medium uppercase tracking-[0.3em] text-[#d4af37] hover:underline">
          ← Zurück
        </Link>
        <h1 className="mt-8 text-4xl font-semibold md:text-5xl">Erklärung zur Barrierefreiheit</h1>

        <div className="mt-10 space-y-6 leading-7 text-white/70">
          <p>
            Diese Website soll für alle Menschen gut nutzbar sein. Ich orientiere mich an den Web Content
            Accessibility Guidelines (WCAG 2.1, Stufe AA).
          </p>

          <h2 className="pt-4 text-xl font-semibold text-white">Was umgesetzt ist</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>„Zum Inhalt springen“-Link für die Bedienung per Tastatur</li>
            <li>Alle Links und Schaltflächen sind per Tastatur erreichbar und haben einen sichtbaren Fokus</li>
            <li>Semantische Struktur mit Überschriften, Landmarks und Sprachangaben (Deutsch/Englisch)</li>
            <li>Ausreichende Farbkontraste auf dunklem Hintergrund</li>
            <li>Animationen und Videos werden bei „Bewegung reduzieren“ im Betriebssystem nicht abgespielt</li>
            <li>Responsives Layout, das sich bis 200 % Zoom ohne Informationsverlust nutzen lässt</li>
          </ul>

          <h2 className="pt-4 text-xl font-semibold text-white">Bekannte Einschränkungen</h2>
          <p>
            Die Video-Vorschauen der Demo-Projekte haben keine Tonspur und keine Untertitel; sie zeigen nur, was in
            den Projekten selbst ausprobiert werden kann.
          </p>

          <h2 className="pt-4 text-xl font-semibold text-white">Feedback</h2>
          <p>
            Wenn dir eine Barriere auffällt, schreib mir gern an{' '}
            <a href="mailto:ukrdiana21@gmail.com" className="text-white underline underline-offset-4 hover:text-[#d4af37]">
              ukrdiana21@gmail.com
            </a>
            . Ich kümmere mich so schnell wie möglich darum.
          </p>

          <p lang="en" className="border-t border-white/10 pt-6 text-sm text-white/50">
            English: This site aims to meet WCAG 2.1 level AA. If you notice a barrier, please email me.
          </p>
        </div>
      </div>
    </main>
  )
}

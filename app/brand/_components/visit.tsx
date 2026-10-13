import Link from 'next/link'
import type { Copy } from '../_lib/content'
import Logo from './logo'

export default function Visit({ copy }: { copy: Copy }) {
  return (
    <>
      <section id="visit" className="scroll-mt-20 bg-[#f3ede2] py-24 text-[#14281f] md:py-32">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 md:px-8 lg:grid-cols-[1fr_1.1fr]">
          <div className="reveal">
            <p className="text-xs uppercase tracking-[0.45em] text-[#8a6d3b]">{copy.visitEyebrow}</p>
            <h2 className="mt-5 font-display text-5xl font-medium leading-tight md:text-6xl">{copy.address}</h2>
            <h3 className="mt-10 text-xs uppercase tracking-[0.3em] text-[#14281f]/55">{copy.hoursTitle}</h3>
            <dl className="mt-4 divide-y divide-[#14281f]/10 border-y border-[#14281f]/10">
              {copy.hours.map(([day, time]) => (
                <div key={day} className="flex justify-between gap-4 py-4">
                  <dt className="font-medium">{day}</dt>
                  <dd className="text-right text-[#14281f]/65">{time}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="https://www.openstreetmap.org/search?query=Oranienstra%C3%9Fe%2044%20Berlin"
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-[#14281f] px-6 py-3.5 text-sm font-medium text-[#f3ede2] transition hover:bg-black"
              >
                {copy.directions} ↗
              </a>
              <a href={`mailto:${copy.contact}`} className="rounded-full border border-[#14281f]/20 px-6 py-3.5 text-sm font-medium transition hover:border-[#14281f]">
                {copy.contact}
              </a>
            </div>
          </div>

          {/* Stylised map: streets as lines, the restaurant as a glowing pin */}
          <div className="reveal relative min-h-[22rem] overflow-hidden rounded-[2rem] bg-[#14281f]" aria-hidden="true">
            <svg viewBox="0 0 600 460" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
              <defs>
                <radialGradient id="pin-glow">
                  <stop offset="0%" stopColor="#c8a46a" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="#c8a46a" stopOpacity="0" />
                </radialGradient>
              </defs>
              <path d="M-20 300 C 150 270, 300 330, 620 250" stroke="#2f5c4a" strokeWidth="28" fill="none" />
              <g stroke="#f3ede2" strokeOpacity="0.12" fill="none">
                <path d="M-10 120 L620 180" strokeWidth="10" />
                <path d="M-10 380 L620 420" strokeWidth="6" />
                <path d="M120 -10 L180 470" strokeWidth="8" />
                <path d="M330 -10 L300 470" strokeWidth="12" />
                <path d="M480 -10 L540 470" strokeWidth="6" />
                <path d="M-10 230 L620 220" strokeWidth="4" />
              </g>
              <circle cx="320" cy="205" r="90" fill="url(#pin-glow)" />
              <circle cx="320" cy="205" r="10" fill="#c8a46a" />
              <circle cx="320" cy="205" r="22" fill="none" stroke="#c8a46a" strokeOpacity="0.5" />
              <text x="345" y="196" fill="#f3ede2" fontSize="16" fontFamily="var(--font-cormorant), serif">Maison Verde</text>
              <text x="345" y="216" fill="#f3ede2" fillOpacity="0.5" fontSize="11" letterSpacing="2">ORANIENSTR. 44</text>
              <text x="40" y="292" fill="#9cc2b1" fillOpacity="0.7" fontSize="11" letterSpacing="3">LANDWEHRKANAL</text>
            </svg>
          </div>
        </div>
      </section>

      <footer className="bg-[#0f1f1a] text-[#f3ede2]">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-14 md:flex-row md:items-end md:justify-between md:px-8">
          <div>
            <Logo />
            <p className="mt-6 max-w-sm text-sm leading-6 text-white/50">{copy.footer}</p>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/65">
            <Link href="/brand/admin" className="hover:text-white">
              {copy.adminLink} →
            </Link>
            <Link href="/" className="hover:text-white">
              {copy.portfolio}: Diana Tsymbaliuk
            </Link>
          </div>
        </div>
      </footer>
    </>
  )
}

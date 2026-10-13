'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import type { Copy, Language } from '../_lib/content'
import Logo from './logo'

export default function SiteHeader({
  copy,
  language,
  onLanguage,
}: {
  copy: Copy
  language: Language
  onLanguage: (language: Language) => void
}) {
  const [solid, setSolid] = useState(false)
  const menuRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    ['#story', copy.navStory],
    ['#menu', copy.navMenu],
    ['#gallery', copy.navGallery],
    ['#visit', copy.navVisit],
  ]

  const languageToggle = (
    <div role="group" aria-label="Language" className="flex rounded-full border border-current/25 p-0.5 text-xs">
      {(['EN', 'DE'] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onLanguage(option)}
          aria-pressed={language === option}
          className={`rounded-full px-2.5 py-1 transition ${language === option ? 'bg-[#f3ede2] text-[#14281f]' : 'opacity-70 hover:opacity-100'}`}
        >
          {option}
        </button>
      ))}
    </div>
  )

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 text-[#f3ede2] transition-all duration-500 ${
          solid ? 'bg-[#0f1f1a]/90 py-3 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl' : 'py-6'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 md:px-8">
          <a href="#top" aria-label="Maison Verde, back to top">
            <Logo />
          </a>
          <nav aria-label="Main" className="hidden items-center gap-8 text-sm lg:flex">
            {links.map(([href, label]) => (
              <a key={href} href={href} className="relative py-1 opacity-80 transition hover:opacity-100 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-[#c8a46a] after:transition after:duration-300 hover:after:scale-x-100">
                {label}
              </a>
            ))}
            <Link href="/brand/admin" className="opacity-60 transition hover:opacity-100">
              {copy.navAdmin}
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block">{languageToggle}</span>
            <a
              href="#reserve"
              className="hidden rounded-full bg-[#c8a46a] px-5 py-2.5 text-sm font-medium text-[#0f1f1a] transition hover:bg-[#e0c48e] sm:inline-flex"
            >
              {copy.reserve}
            </a>
            <button
              type="button"
              onClick={() => menuRef.current?.showModal()}
              aria-label="Open menu"
              className="grid h-11 w-11 place-items-center rounded-full border border-current/25 lg:hidden"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.5" strokeLinecap="round">
                <path d="M4 8h16M4 16h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <dialog
        ref={menuRef}
        aria-label="Menu"
        onClick={(event) => {
          if (event.target === event.currentTarget || (event.target as HTMLElement).closest('a')) menuRef.current?.close()
        }}
        className="m-0 h-dvh max-h-none w-full max-w-none bg-[#0f1f1a] p-0 text-[#f3ede2] backdrop:bg-black/60 open:motion-safe:animate-[modal-in_0.4s_cubic-bezier(0.22,1,0.36,1)]"
      >
        <div className="flex h-full flex-col px-6 py-6">
          <div className="flex items-center justify-between">
            <Logo />
            <button
              type="button"
              onClick={() => menuRef.current?.close()}
              aria-label="Close menu"
              className="grid h-11 w-11 place-items-center rounded-full border border-white/20 text-2xl"
            >
              ×
            </button>
          </div>
          <nav aria-label="Main" className="mt-14 grid gap-2">
            {links.map(([href, label]) => (
              <a key={href} href={href} className="font-display text-5xl">
                {label}
              </a>
            ))}
            <Link href="/brand/admin" className="mt-4 text-sm opacity-60">
              {copy.adminLink} →
            </Link>
          </nav>
          <div className="mt-auto flex items-center justify-between gap-4">
            {languageToggle}
            <a href="#reserve" className="rounded-full bg-[#c8a46a] px-6 py-3 text-sm font-medium text-[#0f1f1a]">
              {copy.reserve}
            </a>
          </div>
        </div>
      </dialog>
    </>
  )
}

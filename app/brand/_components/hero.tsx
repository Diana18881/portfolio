'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { IMAGES, type Copy } from '../_lib/content'

const TOUR_VIDEO = '/brand-tour.mp4'
const TOUR_POSTER = '/brand-tour-poster.jpg'

export default function Hero({ copy, openToday }: { copy: Copy; openToday: boolean | null }) {
  const [tourOpen, setTourOpen] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (tourOpen && !dialog.open) {
      dialog.showModal()
      videoRef.current?.play().catch(() => {})
    }
    if (!tourOpen && dialog.open) dialog.close()
    if (!tourOpen) videoRef.current?.pause()
  }, [tourOpen])

  return (
    <section id="top" className="relative flex min-h-[100svh] items-end overflow-hidden bg-[#0f1f1a] text-[#f3ede2]">
      <Image
        src={IMAGES.hero}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-80 motion-safe:animate-[ken-burns_24s_ease-out_both]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0f1f1a] via-[#0f1f1a]/40 to-[#0f1f1a]/30" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_80%,rgba(200,164,106,0.18),transparent_55%)]" />

      <div className="relative mx-auto w-full max-w-7xl px-5 pb-20 pt-40 md:px-8 md:pb-28">
        {openToday !== null ? (
          <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/20 px-4 py-2 text-xs backdrop-blur-md motion-safe:animate-[fade-up_0.9s_ease-out_both]">
            <span className={`h-2 w-2 rounded-full ${openToday ? 'bg-[#7fd18b]' : 'bg-[#d58b6f]'}`} />
            {openToday ? copy.openNow : copy.closedToday}
          </p>
        ) : null}
        <p className="mt-8 text-xs uppercase tracking-[0.5em] text-[#c8a46a] motion-safe:animate-[fade-up_0.9s_0.1s_ease-out_both]">
          {copy.heroEyebrow}
        </p>
        <h1 className="mt-5 font-display text-[clamp(3.4rem,9vw,8.5rem)] font-medium leading-[0.92]">
          <span className="block motion-safe:animate-[fade-up_1s_0.2s_ease-out_both]">{copy.heroTitle[0]}</span>
          <span className="block italic text-[#e3cf9f] motion-safe:animate-[fade-up_1s_0.35s_ease-out_both]">{copy.heroTitle[1]}</span>
        </h1>
        <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <p className="max-w-md text-lg leading-8 text-[#f3ede2]/75 motion-safe:animate-[fade-up_1s_0.5s_ease-out_both]">{copy.heroText}</p>
          <div className="flex flex-wrap gap-3 motion-safe:animate-[fade-up_1s_0.6s_ease-out_both]">
            <a href="#reserve" className="rounded-full bg-[#c8a46a] px-7 py-4 text-sm font-medium text-[#0f1f1a] transition hover:bg-[#e0c48e]">
              {copy.reserve}
            </a>
            <a href="#menu" className="rounded-full border border-white/30 px-7 py-4 text-sm font-medium backdrop-blur-md transition hover:bg-white hover:text-[#0f1f1a]">
              {copy.viewMenu}
            </a>
            <button
              type="button"
              onClick={() => setTourOpen(true)}
              className="group inline-flex items-center gap-3 rounded-full border border-white/30 py-2 pl-2 pr-6 text-sm font-medium backdrop-blur-md transition hover:bg-white hover:text-[#0f1f1a]"
            >
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[#c8a46a] text-[#0f1f1a] transition group-hover:scale-110">
                <svg viewBox="0 0 24 24" aria-hidden="true" className="ml-0.5 h-4 w-4 fill-current">
                  <path d="M8 5.5v13l10.5-6.5L8 5.5Z" />
                </svg>
              </span>
              {copy.watchTour}
            </button>
          </div>
        </div>
      </div>

      <a href="#story" className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[0.65rem] uppercase tracking-[0.4em] text-white/50 md:flex">
        {copy.scroll}
        <span className="h-10 w-px overflow-hidden bg-white/15">
          <span className="block h-1/2 w-px bg-[#c8a46a] motion-safe:animate-[scroll-cue_2s_ease-in-out_infinite]" />
        </span>
      </a>

      <dialog
        ref={dialogRef}
        onClose={() => setTourOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setTourOpen(false)
        }}
        aria-label={copy.tourLabel}
        className="m-auto w-[min(72rem,calc(100%-2rem))] overflow-visible bg-transparent p-0 backdrop:bg-black/80 backdrop:backdrop-blur-md open:motion-safe:animate-[modal-in_0.45s_cubic-bezier(0.22,1,0.36,1)]"
      >
        <button
          type="button"
          onClick={() => setTourOpen(false)}
          aria-label={copy.closeVideo}
          className="absolute -top-14 right-0 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition hover:rotate-90 hover:bg-white hover:text-black"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current stroke-2">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
        <video
          ref={videoRef}
          src={TOUR_VIDEO}
          poster={TOUR_POSTER}
          controls
          playsInline
          preload="none"
          className="aspect-video w-full rounded-[1.5rem] bg-black shadow-2xl"
        />
      </dialog>
    </section>
  )
}

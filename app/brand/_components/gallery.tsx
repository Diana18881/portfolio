'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { gallery, type Copy, type Language } from '../_lib/content'
import { ArrowButton } from './arrows'

export default function Gallery({ copy, language }: { copy: Copy; language: Language }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const touchX = useRef<number | null>(null)
  const [open, setOpen] = useState<number | null>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open !== null && !dialog.open) dialog.showModal()
    if (open === null && dialog.open) dialog.close()
  }, [open])

  const step = (direction: 1 | -1) =>
    setOpen((current) => (current === null ? null : (current + direction + gallery.length) % gallery.length))

  return (
    <section id="gallery" className="scroll-mt-20 bg-[#f3ede2] pb-24 text-[#14281f] md:pb-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <p className="text-xs uppercase tracking-[0.45em] text-[#8a6d3b]">{copy.galleryEyebrow}</p>
        <h2 className="mt-5 max-w-xl font-display text-5xl font-medium md:text-6xl">{copy.galleryTitle}</h2>
        <div className="mt-12 columns-1 gap-5 sm:columns-2 lg:columns-3">
          {gallery.map((image, index) => (
            <button
              key={image.src}
              type="button"
              onClick={() => setOpen(index)}
              className="reveal group relative mb-5 block w-full overflow-hidden rounded-[1.5rem]"
              aria-label={image.alt[language]}
            >
              <Image
                src={image.src}
                alt=""
                width={800}
                height={image.tall ? 1120 : 550}
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                className={`w-full object-cover transition duration-[1200ms] ease-out group-hover:scale-105 ${image.tall ? 'aspect-[5/7]' : 'aspect-[16/11]'}`}
              />
              <span className="absolute inset-0 bg-[#0f1f1a]/0 transition group-hover:bg-[#0f1f1a]/25" />
              <span className="absolute bottom-4 left-4 translate-y-2 rounded-full bg-[#f3ede2]/90 px-3 py-1.5 text-xs opacity-0 backdrop-blur transition group-hover:translate-y-0 group-hover:opacity-100">
                {image.alt[language]}
              </span>
            </button>
          ))}
        </div>
      </div>

      <dialog
        ref={dialogRef}
        onClose={() => setOpen(null)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight') step(1)
          if (event.key === 'ArrowLeft') step(-1)
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) setOpen(null)
        }}
        aria-label={copy.galleryEyebrow}
        className="m-0 h-dvh max-h-none w-full max-w-none bg-black/95 p-0 text-white backdrop:bg-black"
      >
        {open !== null ? (
          <div
            className="flex h-full flex-col"
            onTouchStart={(event) => (touchX.current = event.touches[0].clientX)}
            onTouchEnd={(event) => {
              if (touchX.current === null) return
              const delta = event.changedTouches[0].clientX - touchX.current
              if (Math.abs(delta) > 50) step(delta < 0 ? 1 : -1)
              touchX.current = null
            }}
          >
            <div className="flex items-center justify-between px-5 py-4 text-sm">
              <span className="font-display text-xl">
                {String(open + 1).padStart(2, '0')} <span className="text-white/40">/ {String(gallery.length).padStart(2, '0')}</span>
              </span>
              <button type="button" onClick={() => setOpen(null)} aria-label={copy.close} className="grid h-11 w-11 place-items-center rounded-full border border-white/20 text-2xl transition hover:rotate-90">
                ×
              </button>
            </div>
            <div className="relative flex flex-1 items-center justify-center px-4">
              <Image
                key={gallery[open].src}
                src={gallery[open].src}
                alt={gallery[open].alt[language]}
                width={1600}
                height={1100}
                sizes="100vw"
                className="max-h-[78dvh] w-auto max-w-full rounded-2xl object-contain motion-safe:animate-[modal-in_0.4s_ease-out]"
              />
              <div className="absolute inset-x-4 top-1/2 flex -translate-y-1/2 justify-between">
                <ArrowButton direction="prev" label={copy.prev} onClick={() => step(-1)} tone="light" />
                <ArrowButton direction="next" label={copy.next} onClick={() => step(1)} tone="light" />
              </div>
            </div>
            <p className="px-5 py-5 text-center text-sm text-white/60">{gallery[open].alt[language]}</p>
          </div>
        ) : null}
      </dialog>
    </section>
  )
}

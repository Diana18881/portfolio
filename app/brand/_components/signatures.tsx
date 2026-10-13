'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { signatures, type Copy, type Language } from '../_lib/content'
import { ArrowButton } from './arrows'

// Line the first card up with the page content while letting the row bleed to the screen edge.
const EDGE = 'max(1.25rem, calc((100vw - 80rem) / 2 + 2rem))'

export default function Signatures({ copy, language }: { copy: Copy; language: Language }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const dish = openIndex === null ? null : signatures[openIndex]

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (dish && !dialog.open) dialog.showModal()
    if (!dish && dialog.open) dialog.close()
  }, [dish])

  const scroll = (direction: 1 | -1) =>
    trackRef.current?.scrollBy({ left: direction * trackRef.current.clientWidth * 0.75, behavior: 'smooth' })

  return (
    <section className="overflow-hidden bg-[#0f1f1a] py-24 text-[#f3ede2] md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="reveal">
            <p className="text-xs uppercase tracking-[0.45em] text-[#c8a46a]">{copy.signaturesEyebrow}</p>
            <h2 className="mt-5 font-display text-5xl font-medium md:text-6xl">{copy.signaturesTitle}</h2>
          </div>
          <div className="flex gap-3">
            <ArrowButton direction="prev" label={copy.prev} onClick={() => scroll(-1)} tone="light" />
            <ArrowButton direction="next" label={copy.next} onClick={() => scroll(1)} tone="light" />
          </div>
        </div>
      </div>

      <div
        ref={trackRef}
        className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none]"
        style={{ paddingInline: EDGE, scrollPaddingInline: EDGE }}
      >
        {signatures.map((item, index) => (
          <button
            key={item.name}
            type="button"
            onClick={() => setOpenIndex(index)}
            className="group relative w-[78%] shrink-0 snap-start overflow-hidden rounded-[1.75rem] text-left sm:w-[46%] lg:w-[31%]"
          >
            <Image
              src={item.image}
              alt={item.name}
              width={800}
              height={1000}
              sizes="(min-width: 1024px) 30vw, 75vw"
              className="aspect-[4/5] w-full object-cover transition duration-[1200ms] ease-out group-hover:scale-110"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
            <span className="absolute inset-x-6 bottom-6">
              <span className="flex items-baseline justify-between gap-4">
                <span className="font-display text-3xl">{item.name}</span>
                <span className="font-display text-2xl text-[#e3cf9f]">€{item.price}</span>
              </span>
              <span className="mt-2 block text-sm text-white/65">{item.note[language]}</span>
              <span className="mt-4 inline-flex translate-y-2 items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#c8a46a] opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:opacity-100">
                {copy.tapForDetails} →
              </span>
            </span>
          </button>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        onClose={() => setOpenIndex(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setOpenIndex(null)
        }}
        aria-label={dish ? dish.name : copy.dishDetails}
        className="m-auto w-[min(60rem,calc(100%-2rem))] overflow-hidden rounded-[2rem] bg-[#f3ede2] p-0 text-[#14281f] backdrop:bg-black/70 backdrop:backdrop-blur-md open:motion-safe:animate-[modal-in_0.45s_cubic-bezier(0.22,1,0.36,1)]"
      >
        {dish && openIndex !== null ? (
          <div className="grid md:grid-cols-2">
            <Image src={dish.image} alt={dish.name} width={800} height={1000} sizes="(min-width: 768px) 30rem, 100vw" className="aspect-[4/3] w-full object-cover md:aspect-auto md:h-full" />
            <div className="relative flex flex-col p-7 md:p-10">
              <button
                type="button"
                onClick={() => setOpenIndex(null)}
                aria-label={copy.close}
                className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full text-2xl transition hover:rotate-90 hover:bg-black/5"
              >
                ×
              </button>
              <p className="text-xs uppercase tracking-[0.4em] text-[#8a6d3b]">{copy.signaturesEyebrow}</p>
              <h3 className="mt-4 pr-10 font-display text-5xl font-medium leading-none">{dish.name}</h3>
              <p className="mt-5 text-lg leading-8 text-[#14281f]/70">{dish.note[language]}</p>
              <div className="mt-8 flex items-baseline justify-between border-y border-[#14281f]/15 py-5">
                <span className="text-xs uppercase tracking-[0.2em] text-[#14281f]/55">{copy.pairing}</span>
                <span className="font-display text-xl italic">{dish.pairing[language]}</span>
              </div>
              <p className="mt-6 font-display text-5xl">€{dish.price}</p>
              <div className="mt-auto flex items-center justify-between gap-3 pt-10">
                <div className="flex gap-2">
                  <ArrowButton direction="prev" label={copy.prev} onClick={() => setOpenIndex((openIndex + signatures.length - 1) % signatures.length)} />
                  <ArrowButton direction="next" label={copy.next} onClick={() => setOpenIndex((openIndex + 1) % signatures.length)} />
                </div>
                <a
                  href="#reserve"
                  onClick={() => setOpenIndex(null)}
                  className="rounded-full bg-[#14281f] px-6 py-3.5 text-sm font-medium text-[#f3ede2] transition hover:bg-black"
                >
                  {copy.reserve}
                </a>
              </div>
            </div>
          </div>
        ) : null}
      </dialog>
    </section>
  )
}

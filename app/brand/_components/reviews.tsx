'use client'

import { useEffect, useState } from 'react'
import { reviews, type Copy, type Language } from '../_lib/content'
import { ArrowButton } from './arrows'

export default function Reviews({ copy, language }: { copy: Copy; language: Language }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const timer = window.setTimeout(() => setIndex((current) => (current + 1) % reviews.length), 6000)
    return () => window.clearTimeout(timer)
  }, [index, paused])

  const review = reviews[index]

  return (
    <section
      aria-label={copy.reviewsEyebrow}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative overflow-hidden bg-[#14281f] py-24 text-[#f3ede2] md:py-32"
    >
      <span aria-hidden="true" className="pointer-events-none absolute -top-10 left-6 font-display text-[18rem] leading-none text-white/[0.04]">
        “
      </span>
      <div className="relative mx-auto max-w-4xl px-5 text-center md:px-8">
        <p className="text-xs uppercase tracking-[0.45em] text-[#c8a46a]">{copy.reviewsEyebrow}</p>
        <div key={index} aria-live="polite" className="motion-safe:animate-[fade-up_0.7s_ease-out_both]">
          <p className="mt-8 text-lg tracking-[0.3em] text-[#c8a46a]" aria-label={`${review.rating} out of 5`}>
            {'★'.repeat(review.rating)}
            <span className="text-white/20">{'★'.repeat(5 - review.rating)}</span>
          </p>
          <blockquote className="mt-6 font-display text-4xl font-medium italic leading-tight md:text-5xl">
            “{review.quote[language]}”
          </blockquote>
          <p className="mt-6 text-sm uppercase tracking-[0.25em] text-white/50">{review.source}</p>
        </div>
        <div className="mt-12 flex items-center justify-center gap-6">
          <ArrowButton direction="prev" label={copy.prev} onClick={() => setIndex((index + reviews.length - 1) % reviews.length)} tone="light" />
          <div className="flex gap-2">
            {reviews.map((item, dot) => (
              <button
                key={item.source}
                type="button"
                onClick={() => setIndex(dot)}
                aria-label={`${dot + 1} / ${reviews.length}`}
                aria-current={dot === index}
                className={`h-1.5 rounded-full transition-all ${dot === index ? 'w-8 bg-[#c8a46a]' : 'w-1.5 bg-white/25'}`}
              />
            ))}
          </div>
          <ArrowButton direction="next" label={copy.next} onClick={() => setIndex((index + 1) % reviews.length)} tone="light" />
        </div>
      </div>
    </section>
  )
}

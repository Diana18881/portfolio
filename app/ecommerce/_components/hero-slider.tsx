'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, PlayIcon } from './icons'

const hero = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=2000&h=1200&fit=crop&q=80&auto=format`

const slides = [
  {
    eyebrow: 'The autumn edit',
    title: 'Layers worth keeping.',
    text: 'Soft knits, warm coats and honest materials for the colder months.',
    cta: { label: 'Shop clothing', href: '/ecommerce?category=Clothing#catalog' },
    image: hero('1604882767135-b41fac508fff'),
    alt: 'Warm-toned coats and jackets on a clothing rail',
  },
  {
    eyebrow: 'Leather goods',
    title: 'Made to last a decade.',
    text: 'Structured bags in saffiano and croc-embossed leather, finished by hand.',
    cta: { label: 'Shop bags', href: '/ecommerce?category=Bags#catalog' },
    image: hero('1612902456551-333ac5afa26e'),
    alt: 'Mustard leather satchel in soft afternoon light',
  },
  {
    eyebrow: 'Quiet gold',
    title: 'Small details, big light.',
    text: 'Gold vermeil earrings and fine watches to finish every look.',
    cta: { label: 'Shop accessories', href: '/ecommerce?category=Accessories#catalog' },
    image: hero('1727990865600-91f8cb8b0168'),
    alt: 'Gold teardrop earrings on white linen',
  },
]

const AUTOPLAY_MS = 6500

export default function HeroSlider({ onPlayTour }: { onPlayTour?: () => void }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const go = (direction: 1 | -1) =>
    setIndex((current) => (current + direction + slides.length) % slides.length)

  useEffect(() => {
    if (paused) return
    const timer = window.setTimeout(
      () => setIndex((current) => (current + 1) % slides.length),
      AUTOPLAY_MS,
    )
    return () => window.clearTimeout(timer)
  }, [index, paused])

  const slide = slides[index]

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured collections"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="relative mx-auto mt-4 max-w-7xl px-3 md:px-6"
    >
      <div className="relative h-[78vh] min-h-[520px] overflow-hidden rounded-[2rem] bg-[#2a221c] text-white">
        {slides.map((item, slideIndex) => (
          <Image
            key={item.image}
            src={item.image}
            alt={slideIndex === index ? item.alt : ''}
            fill
            priority={slideIndex === 0}
            sizes="(min-width: 1280px) 1280px, 100vw"
            className={`object-cover transition-[opacity,transform] duration-[1400ms] ease-out ${
              slideIndex === index ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent" />

        <div
          key={index}
          aria-live="polite"
          className="relative flex h-full max-w-2xl flex-col justify-end p-8 pb-28 md:p-14 md:pb-32"
        >
          <p className="text-xs uppercase tracking-[0.45em] text-[#e9cf8f] motion-safe:animate-[fade-up_0.8s_ease-out_both]">
            {slide.eyebrow}
          </p>
          <h1 className="mt-5 font-display text-6xl font-medium leading-[0.95] motion-safe:animate-[fade-up_0.8s_0.1s_ease-out_both] md:text-8xl">
            {slide.title}
          </h1>
          <p className="mt-6 max-w-md text-lg leading-8 text-white/80 motion-safe:animate-[fade-up_0.8s_0.2s_ease-out_both]">
            {slide.text}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4 motion-safe:animate-[fade-up_0.8s_0.3s_ease-out_both]">
            <Link
              href={slide.cta.href}
              className="group inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 text-sm font-medium text-black transition hover:bg-[#f0e3c4]"
            >
              {slide.cta.label}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
            {onPlayTour ? (
              <button
                type="button"
                onClick={onPlayTour}
                className="group inline-flex items-center gap-3 rounded-full py-2 pl-2 pr-5 text-sm font-medium text-white"
              >
                <span className="grid h-11 w-11 place-items-center rounded-full border border-white/40 backdrop-blur-md transition group-hover:scale-110 group-hover:bg-white group-hover:text-black">
                  <PlayIcon className="h-4 w-4" />
                </span>
                Watch the 3D store tour
              </button>
            ) : null}
          </div>
        </div>

        <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between gap-6 md:left-14 md:right-10">
          <div className="flex items-center gap-4">
            <span className="hidden whitespace-nowrap font-display text-lg tabular-nums sm:inline">
              {String(index + 1).padStart(2, '0')}
              <span className="text-white/50"> / {String(slides.length).padStart(2, '0')}</span>
            </span>
            <div className="flex gap-2">
              {slides.map((item, slideIndex) => (
                <button
                  key={item.image}
                  type="button"
                  onClick={() => setIndex(slideIndex)}
                  aria-label={`Show slide ${slideIndex + 1}: ${item.eyebrow}`}
                  aria-current={slideIndex === index}
                  className="relative h-1 w-10 overflow-hidden rounded-full bg-white/30"
                >
                  {slideIndex === index ? (
                    <span
                      key={`${index}-${paused}`}
                      className="absolute inset-y-0 left-0 bg-white"
                      style={{
                        animation: paused ? 'none' : `slide-progress ${AUTOPLAY_MS}ms linear forwards`,
                        width: paused ? '100%' : undefined,
                      }}
                    />
                  ) : null}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous slide"
              className="grid h-12 w-12 place-items-center rounded-full border border-white/40 backdrop-blur-md transition hover:bg-white hover:text-black"
            >
              <ArrowLeft />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next slide"
              className="grid h-12 w-12 place-items-center rounded-full border border-white/40 backdrop-blur-md transition hover:bg-white hover:text-black"
            >
              <ArrowRight />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

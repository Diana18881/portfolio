'use client'

import { useEffect, useRef, useState } from 'react'
import type { Product } from '../_lib/products'
import { ArrowLeft, ArrowRight } from './icons'
import ProductCard from './product-card'

export default function ProductCarousel({
  title,
  eyebrow,
  products,
}: {
  title: string
  eyebrow?: string
  products: Product[]
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [edges, setEdges] = useState({ start: true, end: false })

  const updateEdges = () => {
    const track = trackRef.current
    if (!track) return
    setEdges({
      start: track.scrollLeft < 8,
      end: track.scrollLeft + track.clientWidth > track.scrollWidth - 8,
    })
  }

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const observer = new ResizeObserver(updateEdges)
    observer.observe(track)
    return () => observer.disconnect()
  }, [])

  const scroll = (direction: 1 | -1) => {
    const track = trackRef.current
    if (!track) return
    track.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: 'smooth' })
  }

  return (
    <section className="reveal mx-auto max-w-7xl px-5 py-16 md:px-8">
      <div className="flex items-end justify-between gap-6">
        <div>
          {eyebrow ? (
            <p className="text-xs uppercase tracking-[0.4em] text-[#8c6a2f]">{eyebrow}</p>
          ) : null}
          <h2 className="mt-3 font-display text-4xl font-medium md:text-5xl">{title}</h2>
        </div>
        <div className="flex gap-2">
          {([-1, 1] as const).map((direction) => (
            <button
              key={direction}
              type="button"
              onClick={() => scroll(direction)}
              disabled={direction === -1 ? edges.start : edges.end}
              aria-label={direction === -1 ? 'Scroll back' : 'Scroll forward'}
              className="grid h-12 w-12 place-items-center rounded-full border border-black/15 transition hover:bg-[#171412] hover:text-white disabled:pointer-events-none disabled:opacity-30"
            >
              {direction === -1 ? <ArrowLeft /> : <ArrowRight />}
            </button>
          ))}
        </div>
      </div>
      <div
        ref={trackRef}
        onScroll={updateEdges}
        className="-mx-5 mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-5 pb-4 [scrollbar-width:none] md:-mx-8 md:px-8"
      >
        {products.map((product) => (
          <div key={product.id} className="w-[72%] shrink-0 snap-start sm:w-[42%] lg:w-[calc(25%-15px)]">
            <ProductCard product={product} sizes="(min-width: 1024px) 25vw, 70vw" />
          </div>
        ))}
      </div>
    </section>
  )
}

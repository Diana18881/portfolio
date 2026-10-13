'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { products } from '../_lib/products'
import { openQuickView } from '../_lib/store'
import { ArrowLeft, ArrowRight, EyeIcon } from './icons'
import Price from './price'

const featured = [1, 7, 10, 14, 2, 11, 6, 15].map((id) => products.find((p) => p.id === id)!)
const STEP = 360 / featured.length
const CARD_WIDTH = 260
const RADIUS = Math.round(CARD_WIDTH / 2 / Math.tan(Math.PI / featured.length)) + 70
const AUTO_SPEED = 0.06

// A ring of product cards in CSS 3D. One rAF loop eases the ring towards a target angle;
// autoplay, dragging and the arrow buttons only move that target.
export default function Showroom3D() {
  const ringRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([])
  const motion = useRef({
    current: 0,
    target: 0,
    hovering: false,
    dragX: null as number | null,
    dragDistance: 0,
  })
  const [front, setFront] = useState(0)

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let frame = 0
    let lastFront = -1

    const tick = () => {
      const state = motion.current
      if (!reduceMotion && !state.hovering && state.dragX === null) state.target -= AUTO_SPEED
      state.current += (state.target - state.current) * 0.08

      ringRef.current?.style.setProperty(
        'transform',
        `translateZ(-${RADIUS}px) rotateY(${state.current}deg)`,
      )

      cardRefs.current.forEach((card, index) => {
        if (!card) return
        const facing = Math.cos(((index * STEP + state.current) * Math.PI) / 180)
        card.style.filter = `brightness(${0.45 + 0.55 * Math.max(facing, 0)})`
        card.style.zIndex = String(Math.round(facing * 100) + 100)
      })

      const nextFront =
        ((Math.round(-state.current / STEP) % featured.length) + featured.length) % featured.length
      if (nextFront !== lastFront) {
        lastFront = nextFront
        setFront(nextFront)
      }

      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  const step = (direction: 1 | -1) => {
    const state = motion.current
    state.target = (Math.round(state.target / STEP) - direction) * STEP
  }

  const product = featured[front]

  return (
    <section
      aria-labelledby="showroom-title"
      className="relative overflow-hidden bg-[radial-gradient(ellipse_at_top,#3a2e24_0%,#14110f_60%)] py-20 text-white"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-col items-center text-center">
          <p className="text-xs uppercase tracking-[0.45em] text-[#e9cf8f]">Interactive</p>
          <h2 id="showroom-title" className="mt-4 font-display text-5xl font-medium md:text-6xl">
            The 3D showroom
          </h2>
          <p className="mt-4 max-w-md text-white/60">
            Drag to spin the collection, or use the arrows. Click a piece to take a closer look.
          </p>
        </div>
      </div>

      <div
        className="relative mx-auto mt-6 h-[480px] cursor-grab touch-pan-y select-none [perspective:1400px] active:cursor-grabbing"
        onMouseEnter={() => (motion.current.hovering = true)}
        onMouseLeave={() => {
          motion.current.hovering = false
          motion.current.dragX = null
        }}
        onPointerDown={(event) => {
          motion.current.dragX = event.clientX
          motion.current.dragDistance = 0
        }}
        onPointerMove={(event) => {
          const state = motion.current
          if (state.dragX === null) return
          state.target += (event.clientX - state.dragX) * 0.25
          state.dragDistance += Math.abs(event.clientX - state.dragX)
          state.dragX = event.clientX
        }}
        onPointerUp={() => (motion.current.dragX = null)}
        onPointerCancel={() => (motion.current.dragX = null)}
        onClickCapture={(event) => {
          // A drag that ends on a card shouldn't open it.
          if (motion.current.dragDistance > 6) event.stopPropagation()
        }}
      >
        <div className="absolute left-1/2 top-[58%] h-24 w-[46rem] max-w-[90vw] -translate-x-1/2 rounded-[100%] bg-[#e9cf8f]/10 blur-2xl" />
        <div
          ref={ringRef}
          className="absolute left-1/2 top-6 [transform-style:preserve-3d]"
          style={{ width: CARD_WIDTH, marginLeft: -CARD_WIDTH / 2 }}
        >
          {featured.map((item, index) => (
            <button
              key={item.id}
              ref={(element) => {
                cardRefs.current[index] = element
              }}
              type="button"
              onClick={() => openQuickView(item.id)}
              aria-label={`Quick view ${item.name}`}
              className="absolute left-0 top-0 block overflow-hidden rounded-[1.5rem] bg-[#ebe3d8] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)] [backface-visibility:hidden]"
              style={{
                width: CARD_WIDTH,
                transform: `rotateY(${index * STEP}deg) translateZ(${RADIUS}px)`,
              }}
            >
              <Image
                width={520}
                height={650}
                sizes="260px"
                src={item.images[0]}
                alt=""
                draggable={false}
                className="aspect-[4/5] w-full object-cover"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-10 text-left text-sm font-medium">
                {item.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="relative mx-auto -mt-2 flex max-w-xl items-center justify-between gap-6 px-5">
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label="Rotate to previous product"
          className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-white/25 transition hover:scale-105 hover:bg-white hover:text-black"
        >
          <ArrowLeft />
        </button>
        <div key={product.id} aria-live="polite" className="text-center motion-safe:animate-[fade-up_0.5s_ease-out]">
          <p className="text-xs uppercase tracking-[0.3em] text-white/45">{product.category}</p>
          <p className="mt-1 font-display text-2xl">{product.name}</p>
          <div className="mt-1 [&_s]:text-white/40">
            <Price price={product.price} compareAt={product.compareAt} />
          </div>
          <button
            type="button"
            onClick={() => openQuickView(product.id)}
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.15em] backdrop-blur-md transition hover:bg-white hover:text-black"
          >
            <EyeIcon />
            Quick view
          </button>
        </div>
        <button
          type="button"
          onClick={() => step(1)}
          aria-label="Rotate to next product"
          className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-white/25 transition hover:scale-105 hover:bg-white hover:text-black"
        >
          <ArrowRight />
        </button>
      </div>
    </section>
  )
}

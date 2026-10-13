'use client'

import Image from 'next/image'
import { useState } from 'react'
import { ArrowLeft, ArrowRight } from './icons'

export default function ProductGallery({
  images,
  name,
  priority = false,
  compact = false,
}: {
  images: string[]
  name: string
  priority?: boolean
  compact?: boolean
}) {
  const [index, setIndex] = useState(0)
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null)

  const go = (direction: 1 | -1) =>
    setIndex((current) => (current + direction + images.length) % images.length)

  return (
    <div className={`flex gap-4 self-start ${compact ? 'flex-col' : 'flex-col-reverse md:flex-row'}`}>
      {!compact ? (
        <div className="flex gap-3 md:flex-col">
          {images.map((image, imageIndex) => (
            <button
              key={image}
              type="button"
              onClick={() => setIndex(imageIndex)}
              aria-label={`Show image ${imageIndex + 1} of ${images.length}`}
              aria-current={imageIndex === index}
              className={`overflow-hidden rounded-xl transition ${
                imageIndex === index ? 'ring-2 ring-[#171412] ring-offset-2 ring-offset-[#f6f1ea]' : 'opacity-60 hover:opacity-100'
              }`}
            >
              <Image width={160} height={200} src={image} alt="" className="h-24 w-20 object-cover" />
            </button>
          ))}
        </div>
      ) : null}

      <div
        className="group relative flex-1 overflow-hidden rounded-[1.75rem] bg-[#ebe3d8]"
        onMouseMove={(event) => {
          if (compact) return
          const rect = event.currentTarget.getBoundingClientRect()
          setZoom({
            x: ((event.clientX - rect.left) / rect.width) * 100,
            y: ((event.clientY - rect.top) / rect.height) * 100,
          })
        }}
        onMouseLeave={() => setZoom(null)}
      >
        <div
          className="flex transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {images.map((image, imageIndex) => (
            <Image
              key={image}
              width={1000}
              height={1250}
              priority={priority && imageIndex === 0}
              sizes={compact ? '(min-width: 768px) 40vw, 100vw' : '(min-width: 1024px) 50vw, 100vw'}
              src={image}
              alt={imageIndex === 0 ? name : `${name}, detail ${imageIndex}`}
              aria-hidden={imageIndex !== index}
              className="aspect-[4/5] w-full shrink-0 object-cover transition-transform duration-300"
              style={
                zoom && imageIndex === index
                  ? { transform: 'scale(1.6)', transformOrigin: `${zoom.x}% ${zoom.y}%` }
                  : undefined
              }
            />
          ))}
        </div>

        <div className="pointer-events-none absolute inset-x-4 top-1/2 flex -translate-y-1/2 justify-between">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous image"
            className="pointer-events-auto grid h-11 w-11 place-items-center rounded-full bg-white/85 shadow-lg backdrop-blur-md transition hover:scale-110 hover:bg-white md:opacity-0 md:group-hover:opacity-100"
          >
            <ArrowLeft />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next image"
            className="pointer-events-auto grid h-11 w-11 place-items-center rounded-full bg-white/85 shadow-lg backdrop-blur-md transition hover:scale-110 hover:bg-white md:opacity-0 md:group-hover:opacity-100"
          >
            <ArrowRight />
          </button>
        </div>

        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
          {images.map((image, imageIndex) => (
            <span
              key={image}
              className={`h-1.5 rounded-full transition-all ${
                imageIndex === index ? 'w-6 bg-white' : 'w-1.5 bg-white/55'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

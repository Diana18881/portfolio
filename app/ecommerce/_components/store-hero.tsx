'use client'

import { useEffect, useRef, useState } from 'react'
import HeroSlider from './hero-slider'
import { CloseIcon } from './icons'

export const TOUR_VIDEO = '/store-tour.mp4'
export const TOUR_POSTER = '/store-tour-poster.jpg'

export default function StoreHero() {
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
    <>
      <HeroSlider onPlayTour={() => setTourOpen(true)} />
      <dialog
        ref={dialogRef}
        onClose={() => setTourOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setTourOpen(false)
        }}
        aria-label="3D store tour video"
        className="m-auto w-[min(72rem,calc(100%-2rem))] overflow-visible bg-transparent p-0 backdrop:bg-black/80 backdrop:backdrop-blur-md open:motion-safe:animate-[modal-in_0.45s_cubic-bezier(0.22,1,0.36,1)]"
      >
        <button
          type="button"
          onClick={() => setTourOpen(false)}
          aria-label="Close video"
          className="absolute -top-14 right-0 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition hover:rotate-90 hover:bg-white hover:text-black"
        >
          <CloseIcon />
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
    </>
  )
}

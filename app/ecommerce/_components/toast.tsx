'use client'

import Image from 'next/image'
import { useEffect } from 'react'
import { formatPrice, getProductById } from '../_lib/products'
import { dismissToast, openCart, useStore } from '../_lib/store'
import { CloseIcon } from './icons'

const TOAST_MS = 4500

export default function Toast() {
  const { toast } = useStore()
  const product = toast ? getProductById(toast.productId) : undefined

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(dismissToast, TOAST_MS)
    return () => window.clearTimeout(timer)
  }, [toast])

  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex justify-end md:inset-x-6 md:bottom-6">
      {toast && product ? (
        <div
          key={toast.id}
          className="pointer-events-auto relative flex w-full max-w-sm items-center gap-4 overflow-hidden rounded-2xl bg-[#171412] p-3 pr-4 text-white shadow-2xl motion-safe:animate-[toast-in_0.45s_cubic-bezier(0.22,1,0.36,1)]"
        >
          <Image
            width={120}
            height={150}
            src={product.images[0]}
            alt=""
            className="h-20 w-16 rounded-xl object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs uppercase tracking-[0.2em] text-[#e9cf8f]">Added to bag</p>
            <p className="mt-1 truncate font-medium">{product.name}</p>
            <p className="text-sm text-white/55">
              {toast.size} · {formatPrice(product.price)}
            </p>
          </div>
          <button
            type="button"
            onClick={openCart}
            className="rounded-full bg-white px-4 py-2 text-xs font-medium uppercase tracking-[0.12em] text-black transition hover:bg-[#f0e3c4]"
          >
            View bag
          </button>
          <button
            type="button"
            onClick={dismissToast}
            aria-label="Dismiss"
            className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full text-white/50 hover:text-white"
          >
            <CloseIcon className="h-3.5 w-3.5" />
          </button>
          <span
            className="absolute bottom-0 left-0 h-0.5 bg-[#e9cf8f]"
            style={{ animation: `slide-progress ${TOAST_MS}ms linear forwards` }}
          />
        </div>
      ) : null}
    </div>
  )
}

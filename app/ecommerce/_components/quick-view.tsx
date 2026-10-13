'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { getProductById } from '../_lib/products'
import { closeQuickView, useStore } from '../_lib/store'
import { ArrowRight, CloseIcon, StarRating } from './icons'
import Price from './price'
import ProductGallery from './product-gallery'
import PurchasePanel from './purchase-panel'

export default function QuickView() {
  const { quickViewId } = useStore()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const product = quickViewId === null ? undefined : getProductById(quickViewId)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (product && !dialog.open) dialog.showModal()
    if (!product && dialog.open) dialog.close()
  }, [product])

  return (
    <dialog
      ref={dialogRef}
      onClose={closeQuickView}
      onClick={(event) => {
        if (event.target === event.currentTarget) closeQuickView()
      }}
      aria-label={product ? `Quick view: ${product.name}` : 'Quick view'}
      className="m-auto max-h-[92dvh] w-[min(64rem,calc(100%-2rem))] overflow-y-auto rounded-[2rem] bg-[#f6f1ea] p-0 text-[#171412] shadow-2xl backdrop:bg-[#14110f]/55 backdrop:backdrop-blur-md open:motion-safe:animate-[modal-in_0.45s_cubic-bezier(0.22,1,0.36,1)]"
    >
      {product ? (
        <div className="grid gap-8 p-4 md:grid-cols-[1fr_1.05fr] md:p-6">
          <ProductGallery key={product.id} images={product.images} name={product.name} compact />
          <div className="relative pb-2 pr-2 md:py-6">
            <button
              type="button"
              onClick={closeQuickView}
              aria-label="Close quick view"
              className="absolute right-0 top-0 grid h-10 w-10 place-items-center rounded-full transition hover:rotate-90 hover:bg-black/5"
            >
              <CloseIcon />
            </button>
            <p className="text-xs uppercase tracking-[0.3em] text-[#8c6a2f]">{product.tag}</p>
            <h2 className="mt-3 pr-12 font-display text-4xl font-medium leading-tight">
              {product.name}
            </h2>
            <div className="mt-3 flex items-center gap-2 text-sm text-black/55">
              <StarRating rating={product.rating} />
              {product.rating} · {product.reviews} reviews
            </div>
            <div className="mt-5">
              <Price price={product.price} compareAt={product.compareAt} size="lg" />
            </div>
            <p className="mt-5 leading-7 text-black/65">{product.description}</p>
            <PurchasePanel key={product.id} product={product} onAdded={closeQuickView} />
            <Link
              href={`/ecommerce/product/${product.slug}`}
              onClick={closeQuickView}
              className="group mt-6 inline-flex items-center gap-2 text-sm font-medium underline-offset-4 hover:underline"
            >
              View full details
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      ) : null}
    </dialog>
  )
}

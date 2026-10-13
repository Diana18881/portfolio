'use client'

import { useState } from 'react'
import type { Product } from '../_lib/products'
import { addToCart, toggleWishlist, useStore } from '../_lib/store'
import { BagIcon, HeartIcon } from './icons'

export default function PurchasePanel({
  product,
  onAdded,
}: {
  product: Product
  onAdded?: () => void
}) {
  const { wishlist } = useStore()
  const hasSizes = product.sizes.length > 1
  const [size, setSize] = useState(hasSizes ? '' : product.sizes[0])
  const [showSizeError, setShowSizeError] = useState(false)
  const saved = wishlist.includes(product.id)

  const handleAdd = () => {
    if (!size) {
      setShowSizeError(true)
      return
    }

    addToCart(product, size)
    onAdded?.()
  }

  return (
    <div className="mt-8">
      {hasSizes ? (
        <fieldset>
          <div className="flex items-baseline justify-between">
            <legend className="text-xs font-medium uppercase tracking-[0.2em]">
              Size {size ? <span className="text-black/50">· {size}</span> : null}
            </legend>
            <span className="text-xs text-black/45 underline underline-offset-4">Size guide</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.sizes.map((option) => (
              <label key={option} className="cursor-pointer">
                <input
                  type="radio"
                  name={`size-${product.id}`}
                  value={option}
                  checked={size === option}
                  onChange={() => {
                    setSize(option)
                    setShowSizeError(false)
                  }}
                  className="peer sr-only"
                />
                <span className="grid h-12 min-w-14 place-items-center rounded-xl border border-black/15 bg-white px-4 text-sm transition peer-checked:border-[#171412] peer-checked:bg-[#171412] peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#d4af37] hover:border-black/50">
                  {option}
                </span>
              </label>
            ))}
          </div>
          {showSizeError ? (
            <p role="alert" className="mt-2 text-sm text-[#a3412b]">
              Please choose a size.
            </p>
          ) : null}
        </fieldset>
      ) : null}

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={handleAdd}
          className="group flex flex-1 items-center justify-center gap-3 rounded-full bg-[#171412] px-6 py-4 text-sm font-medium uppercase tracking-[0.15em] text-white transition hover:bg-black"
        >
          <BagIcon className="h-[1.1rem] w-[1.1rem] transition group-hover:-translate-y-0.5" />
          Add to bag
        </button>
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-pressed={saved}
          aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
          className={`grid h-[54px] w-[54px] place-items-center rounded-full border transition hover:scale-105 ${
            saved ? 'border-[#171412] bg-[#171412] text-[#e9cf8f]' : 'border-black/15 hover:border-black/50'
          }`}
        >
          <HeartIcon filled={saved} />
        </button>
      </div>
      <ul className="mt-5 grid gap-2 text-sm text-black/60">
        <li className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${product.stock <= 6 ? 'bg-[#d08a2c]' : 'bg-[#4f8a5b]'}`} />
          {product.stock <= 6 ? `Only ${product.stock} left, order soon` : 'In stock, ships in 1–2 days'}
        </li>
        <li className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-black/20" />
          Free returns within 30 days
        </li>
      </ul>
    </div>
  )
}

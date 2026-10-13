'use client'

import { useState } from 'react'
import type { Product } from '../_lib/products'
import { addToCart, toggleWishlist, useStore } from '../_lib/store'

export default function PurchasePanel({ product }: { product: Product }) {
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
  }

  return (
    <div className="mt-8">
      {hasSizes ? (
        <fieldset>
          <legend className="text-sm font-medium">Size</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.sizes.map((option) => (
              <label key={option} className="cursor-pointer">
                <input
                  type="radio"
                  name="size"
                  value={option}
                  checked={size === option}
                  onChange={() => {
                    setSize(option)
                    setShowSizeError(false)
                  }}
                  className="peer sr-only"
                />
                <span className="grid h-11 min-w-12 place-items-center rounded-full border border-black/15 bg-white px-4 text-sm transition peer-checked:border-[#171412] peer-checked:bg-[#171412] peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#d4af37] hover:border-black/40">
                  {option}
                </span>
              </label>
            ))}
          </div>
          {showSizeError ? (
            <p role="alert" className="mt-2 text-sm text-red-700">
              Please choose a size.
            </p>
          ) : null}
        </fieldset>
      ) : null}

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={handleAdd}
          className="flex-1 rounded-full bg-[#171412] px-6 py-4 text-sm font-medium text-white transition hover:bg-black"
        >
          Add to bag
        </button>
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-pressed={saved}
          aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
          className={`grid h-[52px] w-[52px] place-items-center rounded-full border text-lg transition ${
            saved ? 'border-[#171412] bg-[#171412] text-[#d4af37]' : 'border-black/15 hover:border-black/40'
          }`}
        >
          {saved ? '♥' : '♡'}
        </button>
      </div>
      <p className="mt-3 text-sm text-black/55">
        {product.stock <= 5 ? `Only ${product.stock} left in stock` : 'In stock'} · Ships in 1–2
        days
      </p>
    </div>
  )
}

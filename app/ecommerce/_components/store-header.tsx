'use client'

import Link from 'next/link'
import { categories } from '../_lib/products'
import { openCart, useStore } from '../_lib/store'

export default function StoreHeader() {
  const { cart } = useStore()
  const itemCount = cart.reduce((total, line) => total + line.quantity, 0)

  return (
    <>
      <div className="bg-[#171412] text-xs text-white/70">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-1 px-5 py-2.5 md:px-8">
          <Link href="/" className="hover:text-white">
            ← Diana Tsymbaliuk · Portfolio
          </Link>
          <p>
            <span className="hidden sm:inline">Demo store. Orders you place show up in the </span>
            <Link href="/dashboard" className="text-[#d4af37] underline-offset-4 hover:underline">
              Dashboard case →
            </Link>
          </p>
        </div>
      </div>

      <header className="sticky top-0 z-30 border-b border-black/10 bg-[#f7f3ed]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 md:px-8">
          <Link href="/ecommerce" className="text-xl font-semibold tracking-[0.3em]">
            LUMA
          </Link>
          <nav aria-label="Categories" className="hidden gap-7 text-sm text-black/60 md:flex">
            <Link href="/ecommerce#catalog" className="hover:text-black">
              Shop all
            </Link>
            {categories.map((category) => (
              <Link
                key={category}
                href={`/ecommerce?category=${category}#catalog`}
                className="hover:text-black"
              >
                {category}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            onClick={openCart}
            className="flex items-center gap-2 rounded-full bg-[#171412] px-4 py-2 text-sm font-medium text-white transition hover:bg-black"
          >
            Bag
            <span
              aria-label={`${itemCount} items in bag`}
              className="grid h-5 min-w-5 place-items-center rounded-full bg-[#d4af37] px-1 text-xs font-semibold text-black"
            >
              {itemCount}
            </span>
          </button>
        </div>
        <nav
          aria-label="Categories"
          className="flex gap-2 overflow-x-auto px-5 pb-3 text-sm md:hidden"
        >
          <Link href="/ecommerce#catalog" className="shrink-0 rounded-full bg-white px-4 py-2">
            Shop all
          </Link>
          {categories.map((category) => (
            <Link
              key={category}
              href={`/ecommerce?category=${category}#catalog`}
              className="shrink-0 rounded-full bg-white px-4 py-2"
            >
              {category}
            </Link>
          ))}
        </nav>
      </header>
    </>
  )
}

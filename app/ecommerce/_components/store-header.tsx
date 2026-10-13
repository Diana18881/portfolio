'use client'

import Link from 'next/link'
import { categories } from '../_lib/products'
import { openCart, useStore } from '../_lib/store'
import { BagIcon, HeartIcon, SearchIcon } from './icons'
import Logo from './logo'

export default function StoreHeader() {
  const { cart, wishlist } = useStore()
  const itemCount = cart.reduce((total, line) => total + line.quantity, 0)

  return (
    <>
      <div className="bg-[#14110f] text-xs text-white/70">
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

      <header className="sticky top-0 z-30 border-b border-black/[0.07] bg-[#f6f1ea]/85 backdrop-blur-xl">
        <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-6 px-5 py-4 md:px-8">
          <nav aria-label="Categories" className="hidden gap-7 text-[0.8rem] uppercase tracking-[0.18em] text-black/60 lg:flex">
            {categories.map((category) => (
              <Link
                key={category}
                href={`/ecommerce?category=${category}#catalog`}
                className="relative py-1 transition hover:text-black after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition after:duration-300 hover:after:scale-x-100"
              >
                {category}
              </Link>
            ))}
          </nav>
          <Link href="/ecommerce" aria-label="Luma home" className="col-start-2 text-[#171412]">
            <Logo />
          </Link>
          <div className="col-start-3 flex items-center justify-end gap-1">
            <Link
              href="/ecommerce#catalog"
              aria-label="Search products"
              className="grid h-10 w-10 place-items-center rounded-full transition hover:bg-black/5"
            >
              <SearchIcon />
            </Link>
            <Link
              href="/ecommerce?saved=1#catalog"
              aria-label={`Wishlist, ${wishlist.length} saved`}
              className="relative grid h-10 w-10 place-items-center rounded-full transition hover:bg-black/5"
            >
              <HeartIcon />
              {wishlist.length ? (
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[#a3412b]" />
              ) : null}
            </Link>
            <button
              type="button"
              onClick={openCart}
              aria-label={`Open bag, ${itemCount} items`}
              className="relative grid h-10 w-10 place-items-center rounded-full transition hover:bg-black/5"
            >
              <BagIcon />
              <span
                key={itemCount}
                className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-[#171412] px-1 text-[0.65rem] font-semibold text-white motion-safe:animate-[toast-in_0.4s_ease-out]"
              >
                {itemCount}
              </span>
            </button>
          </div>
        </div>
        <nav aria-label="Categories" className="flex gap-2 overflow-x-auto px-5 pb-3 text-sm lg:hidden">
          {categories.map((category) => (
            <Link
              key={category}
              href={`/ecommerce?category=${category}#catalog`}
              className="shrink-0 rounded-full border border-black/10 bg-white/70 px-4 py-2"
            >
              {category}
            </Link>
          ))}
        </nav>
      </header>
    </>
  )
}

'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { Product } from '../_lib/products'
import { addToCart, openQuickView, toggleWishlist, useStore } from '../_lib/store'
import { BagIcon, EyeIcon, HeartIcon } from './icons'
import Price from './price'

export default function ProductCard({
  product,
  sizes = '(min-width: 1280px) 25vw, (min-width: 640px) 33vw, 50vw',
}: {
  product: Product
  sizes?: string
}) {
  const { wishlist } = useStore()
  const saved = wishlist.includes(product.id)
  const oneSize = product.sizes.length === 1

  return (
    <article className="group relative">
      <div className="relative overflow-hidden rounded-[1.25rem] bg-[#ebe3d8]">
        <Image
          width={800}
          height={1000}
          sizes={sizes}
          src={product.images[0]}
          alt={product.name}
          className="aspect-[4/5] w-full object-cover transition duration-[900ms] ease-out group-hover:scale-[1.04] group-hover:opacity-0"
        />
        <Image
          width={800}
          height={1000}
          sizes={sizes}
          src={product.images[1]}
          alt=""
          className="absolute inset-0 aspect-[4/5] w-full scale-110 object-cover opacity-0 transition duration-[900ms] ease-out group-hover:scale-100 group-hover:opacity-100"
        />

        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          <span
            className={`rounded-full px-2.5 py-1 text-[0.6rem] font-medium uppercase tracking-[0.12em] backdrop-blur-md sm:px-3 sm:text-[0.7rem] ${
              product.compareAt ? 'bg-[#a3412b] text-white' : 'bg-white/85 text-black'
            }`}
          >
            {product.tag}
          </span>
          {product.stock <= 6 ? (
            <span className="rounded-full bg-[#171412]/80 px-2.5 py-1 text-[0.6rem] text-white backdrop-blur-md sm:px-3 sm:text-[0.7rem]">
              Only {product.stock} left
            </span>
          ) : null}
        </div>

        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          className={`absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center sm:h-10 sm:w-10 rounded-full backdrop-blur-md transition hover:scale-110 ${
            saved ? 'bg-[#171412] text-[#e9cf8f]' : 'bg-white/80 text-black/70 hover:text-black'
          }`}
        >
          <HeartIcon className="h-[1.15rem] w-[1.15rem]" filled={saved} />
        </button>

        <div className="absolute bottom-3 right-3 z-10 flex gap-2 transition duration-500 md:left-3 md:translate-y-[130%] md:opacity-0 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100 md:group-hover:translate-y-0 md:group-hover:opacity-100">
          <button
            type="button"
            onClick={() => openQuickView(product.id)}
            aria-label={`Quick view ${product.name}`}
            className="flex h-[42px] min-w-[42px] flex-1 items-center justify-center gap-2 rounded-full bg-white/90 text-xs font-medium uppercase tracking-[0.12em] text-black backdrop-blur-md transition hover:bg-white md:px-4"
          >
            <EyeIcon />
            <span className="hidden md:inline">Quick view</span>
          </button>
          {oneSize ? (
            <button
              type="button"
              onClick={() => addToCart(product, product.sizes[0])}
              aria-label={`Add ${product.name} to bag`}
              className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-full bg-[#171412] text-white transition hover:bg-black"
            >
              <BagIcon className="h-[1.1rem] w-[1.1rem]" />
            </button>
          ) : null}
        </div>
      </div>

      <div className="mt-4">
        <p className="text-[0.7rem] uppercase tracking-[0.2em] text-black/45">{product.category}</p>
        <h3 className="mt-1 font-medium leading-snug">
          <Link
            href={`/ecommerce/product/${product.slug}`}
            className="before:absolute before:inset-0 before:z-0"
          >
            {product.name}
          </Link>
        </h3>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <Price price={product.price} compareAt={product.compareAt} showDiscount={false} />
          <p className="flex items-center gap-2 text-sm text-black/55">
            <span
              aria-hidden="true"
              className="h-3 w-3 rounded-full ring-1 ring-black/15"
              style={{ backgroundColor: product.swatch }}
            />
            {product.color}
          </p>
        </div>
      </div>
    </article>
  )
}

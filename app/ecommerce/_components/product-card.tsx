'use client'

import Image from 'next/image'
import Link from 'next/link'
import { formatPrice, type Product } from '../_lib/products'
import { toggleWishlist, useStore } from '../_lib/store'

export default function ProductCard({ product }: { product: Product }) {
  const { wishlist } = useStore()
  const saved = wishlist.includes(product.id)

  return (
    <article className="group relative">
      <div className="relative overflow-hidden rounded-2xl bg-[#ebe4da]">
        <Image
          width={800}
          height={1000}
          sizes="(min-width: 1280px) 25vw, (min-width: 640px) 33vw, 50vw"
          src={product.image}
          alt={product.name}
          className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium">
          {product.tag}
        </span>
        {product.stock <= 5 ? (
          <span className="absolute bottom-3 left-3 rounded-full bg-[#171412]/85 px-3 py-1 text-xs text-white">
            Only {product.stock} left
          </span>
        ) : null}
      </div>
      <button
        type="button"
        onClick={() => toggleWishlist(product.id)}
        aria-pressed={saved}
        aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
        className={`absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full text-base shadow-sm transition ${
          saved ? 'bg-[#171412] text-[#d4af37]' : 'bg-white/90 text-black/60 hover:text-black'
        }`}
      >
        {saved ? '♥' : '♡'}
      </button>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-medium">
            <Link href={`/ecommerce/product/${product.slug}`} className="after:absolute after:inset-0">
              {product.name}
            </Link>
          </h3>
          <p className="mt-0.5 text-sm text-black/55">
            {product.color} · ★ {product.rating}
          </p>
        </div>
        <p className="font-medium">{formatPrice(product.price)}</p>
      </div>
    </article>
  )
}

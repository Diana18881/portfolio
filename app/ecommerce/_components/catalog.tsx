'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
import { categories, formatPrice, products } from '../_lib/products'
import { useStore } from '../_lib/store'
import { HeartIcon, SearchIcon } from './icons'
import ProductCard from './product-card'

const sortOptions = {
  featured: 'Featured',
  'price-asc': 'Price: low to high',
  'price-desc': 'Price: high to low',
  rating: 'Top rated',
  sale: 'On sale first',
} as const

type SortKey = keyof typeof sortOptions

const PRICE_CEILING = Math.max(...products.map((product) => product.price))

// Filters live in the URL so a filtered catalog can be shared and survives a reload.
export default function Catalog() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { wishlist } = useStore()

  const category = searchParams.get('category') ?? 'All'
  const query = searchParams.get('q') ?? ''
  const sort = (searchParams.get('sort') ?? 'featured') as SortKey
  const maxPrice = Number(searchParams.get('max')) || PRICE_CEILING
  const savedOnly = searchParams.get('saved') === '1'

  const updateParams = (changes: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())

    Object.entries(changes).forEach(([key, value]) => {
      if (value === null || value === '') params.delete(key)
      else params.set(key, value)
    })

    const queryString = params.toString()
    // Native history updates keep typing instant; Next syncs useSearchParams with them.
    window.history.replaceState(null, '', queryString ? `${pathname}?${queryString}` : pathname)
  }

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    const result = products.filter(
      (product) =>
        (category === 'All' || product.category === category) &&
        product.price <= maxPrice &&
        (!savedOnly || wishlist.includes(product.id)) &&
        (!normalizedQuery ||
          `${product.name} ${product.color} ${product.category}`
            .toLowerCase()
            .includes(normalizedQuery)),
    )

    return result.sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price
      if (sort === 'price-desc') return b.price - a.price
      if (sort === 'rating') return b.rating - a.rating
      if (sort === 'sale') return Number(Boolean(b.compareAt)) - Number(Boolean(a.compareAt))
      return a.id - b.id
    })
  }, [category, query, sort, maxPrice, savedOnly, wishlist])

  const hasFilters = category !== 'All' || query || maxPrice < PRICE_CEILING || savedOnly

  return (
    <section id="catalog" className="mx-auto max-w-7xl scroll-mt-28 px-5 py-20 md:px-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-[#8c6a2f]">The collection</p>
          <h2 className="mt-3 font-display text-5xl font-medium md:text-6xl">
            {savedOnly ? 'Your wishlist' : category === 'All' ? 'Shop everything' : category}
          </h2>
        </div>
        <p aria-live="polite" className="text-sm text-black/55">
          {filteredProducts.length} {filteredProducts.length === 1 ? 'piece' : 'pieces'}
        </p>
      </div>

      <div className="z-20 lg:sticky lg:top-[73px] -mx-5 mt-8 border-y border-black/[0.08] bg-[#f6f1ea]/90 px-5 py-4 backdrop-blur-xl md:-mx-8 md:px-8">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div role="group" aria-label="Category" className="flex flex-wrap gap-2">
            {['All', ...categories].map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={category === item && !savedOnly}
                onClick={() => updateParams({ category: item === 'All' ? null : item, saved: null })}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  category === item && !savedOnly
                    ? 'bg-[#171412] text-white'
                    : 'bg-white text-black/65 hover:text-black'
                }`}
              >
                {item}
              </button>
            ))}
            <button
              type="button"
              aria-pressed={savedOnly}
              onClick={() => updateParams({ saved: savedOnly ? null : '1' })}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition ${
                savedOnly ? 'bg-[#a3412b] text-white' : 'bg-white text-black/65 hover:text-black'
              }`}
            >
              <HeartIcon className="h-4 w-4" filled={savedOnly} />
              Saved ({wishlist.length})
            </button>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="flex items-center gap-3 text-sm text-black/60">
              <span className="w-24 shrink-0">Up to {formatPrice(maxPrice)}</span>
              <input
                type="range"
                min={50}
                max={PRICE_CEILING}
                step={10}
                value={maxPrice}
                onChange={(event) =>
                  updateParams({
                    max: Number(event.target.value) >= PRICE_CEILING ? null : event.target.value,
                  })
                }
                className="w-full accent-[#171412] sm:w-28"
              />
            </label>
            <label className="relative">
              <span className="sr-only">Search products</span>
              <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40" />
              <input
                type="search"
                value={query}
                onChange={(event) => updateParams({ q: event.target.value })}
                placeholder="Search"
                className="w-full rounded-full border border-black/10 bg-white py-2 pl-10 pr-4 text-sm outline-none focus:border-black/40 sm:w-44"
              />
            </label>
            <select
              value={sort}
              onChange={(event) =>
                updateParams({ sort: event.target.value === 'featured' ? null : event.target.value })
              }
              aria-label="Sort products"
              className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm outline-none focus:border-black/40"
            >
              {Object.entries(sortOptions).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredProducts.length ? (
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-3 md:gap-x-6 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="reveal">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-[2rem] bg-white p-12 text-center">
          <p className="font-display text-3xl">
            {savedOnly ? 'Nothing saved yet' : 'No pieces match these filters'}
          </p>
          <p className="mt-2 text-black/55">
            {savedOnly
              ? 'Tap the heart on any product to keep it here.'
              : 'Try another category or a higher price limit.'}
          </p>
        </div>
      )}

      {hasFilters ? (
        <button
          type="button"
          onClick={() => window.history.replaceState(null, '', pathname)}
          className="mt-10 text-sm text-black/60 underline underline-offset-4 hover:text-black"
        >
          Reset all filters
        </button>
      ) : null}
    </section>
  )
}

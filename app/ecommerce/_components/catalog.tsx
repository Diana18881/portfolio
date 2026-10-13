'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
import { categories, formatPrice, products } from '../_lib/products'
import ProductCard from './product-card'

const sortOptions = {
  featured: 'Featured',
  'price-asc': 'Price: low to high',
  'price-desc': 'Price: high to low',
  rating: 'Top rated',
} as const

type SortKey = keyof typeof sortOptions

const PRICE_CEILING = Math.max(...products.map((product) => product.price))

// Filters live in the URL so a filtered catalog can be shared and survives a reload.
export default function Catalog() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const category = searchParams.get('category') ?? 'All'
  const query = searchParams.get('q') ?? ''
  const sort = (searchParams.get('sort') ?? 'featured') as SortKey
  const maxPrice = Number(searchParams.get('max')) || PRICE_CEILING

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
        (!normalizedQuery ||
          `${product.name} ${product.color} ${product.category}`
            .toLowerCase()
            .includes(normalizedQuery)),
    )

    return result.sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price
      if (sort === 'price-desc') return b.price - a.price
      if (sort === 'rating') return b.rating - a.rating
      return a.id - b.id
    })
  }, [category, query, sort, maxPrice])

  const hasFilters = category !== 'All' || query || maxPrice < PRICE_CEILING

  return (
    <section id="catalog" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-16 md:px-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-[#8c6a2f]">
            The edit
          </p>
          <h2 className="mt-2 text-3xl font-semibold md:text-4xl">
            {category === 'All' ? 'All products' : category}
          </h2>
        </div>
        <p aria-live="polite" className="text-sm text-black/55">
          {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-4 border-y border-black/10 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label="Category" className="flex flex-wrap gap-2">
          {['All', ...categories].map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={category === item}
              onClick={() => updateParams({ category: item === 'All' ? null : item })}
              className={`rounded-full px-4 py-2 text-sm transition ${
                category === item
                  ? 'bg-[#171412] text-white'
                  : 'bg-white text-black/65 hover:text-black'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="flex items-center gap-3 text-sm text-black/60">
            <span className="shrink-0">Up to {formatPrice(maxPrice)}</span>
            <input
              type="range"
              min={60}
              max={PRICE_CEILING}
              step={10}
              value={maxPrice}
              onChange={(event) =>
                updateParams({
                  max:
                    Number(event.target.value) >= PRICE_CEILING ? null : event.target.value,
                })
              }
              className="w-full accent-[#171412] sm:w-32"
            />
          </label>
          <input
            type="search"
            value={query}
            onChange={(event) => updateParams({ q: event.target.value })}
            placeholder="Search"
            aria-label="Search products"
            className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm outline-none focus:border-black/40"
          />
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

      {filteredProducts.length ? (
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-2xl bg-white p-10 text-center">
          <p className="text-lg font-medium">No products match these filters.</p>
          <p className="mt-2 text-black/55">Try another category or a higher price limit.</p>
        </div>
      )}

      {hasFilters ? (
        <button
          type="button"
          onClick={() => window.history.replaceState(null, '', pathname)}
          className="mt-8 text-sm text-black/60 underline underline-offset-4 hover:text-black"
        >
          Reset all filters
        </button>
      ) : null}
    </section>
  )
}

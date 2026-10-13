import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { StarRating } from '../../_components/icons'
import Price from '../../_components/price'
import ProductCarousel from '../../_components/product-carousel'
import ProductGallery from '../../_components/product-gallery'
import PurchasePanel from '../../_components/purchase-panel'
import { FREE_SHIPPING_FROM, formatPrice, getProduct, products } from '../../_lib/products'

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = getProduct((await params).slug)

  return product ? { title: product.name, description: product.description } : {}
}

export default async function ProductPage({ params }: Props) {
  const product = getProduct((await params).slug)
  if (!product) notFound()

  const related = [
    ...products.filter((item) => item.category === product.category && item.id !== product.id),
    ...products.filter((item) => item.category !== product.category),
  ].slice(0, 8)

  return (
    <main>
      <div className="mx-auto max-w-7xl px-5 py-8 md:px-8">
        <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-[0.18em] text-black/45">
          <ol className="flex flex-wrap gap-2">
            <li>
              <Link href="/ecommerce" className="hover:text-black">
                Shop
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href={`/ecommerce?category=${product.category}#catalog`} className="hover:text-black">
                {product.category}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-black">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <ProductGallery images={product.images} name={product.name} priority />

          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-xs uppercase tracking-[0.35em] text-[#8c6a2f]">{product.tag}</p>
            <h1 className="mt-4 font-display text-5xl font-medium leading-[1.05] md:text-6xl">
              {product.name}
            </h1>
            <div className="mt-4 flex items-center gap-2 text-sm text-black/55">
              <StarRating rating={product.rating} />
              <span>
                {product.rating} · {product.reviews} reviews
              </span>
            </div>
            <div className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-2 border-y border-black/10 py-5">
              <Price price={product.price} compareAt={product.compareAt} size="lg" />
              <span className="text-sm text-black/50">
                or 3 × {formatPrice(Math.ceil(product.price / 3))} interest-free
              </span>
            </div>
            <p className="mt-6 text-lg leading-8 text-black/65">{product.description}</p>
            <p className="mt-5 flex items-center gap-3 text-sm">
              <span className="text-xs uppercase tracking-[0.2em] text-black/50">Colour</span>
              <span
                aria-hidden="true"
                className="h-5 w-5 rounded-full ring-1 ring-black/15 ring-offset-2 ring-offset-[#f6f1ea]"
                style={{ backgroundColor: product.swatch }}
              />
              {product.color}
            </p>

            <PurchasePanel product={product} />

            <div className="mt-8 divide-y divide-black/10 border-y border-black/10">
              <details open className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-medium uppercase tracking-[0.2em]">
                  Details & materials
                  <span className="text-lg transition group-open:rotate-45">+</span>
                </summary>
                <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-black/65">
                  {product.details.map((detail) => (
                    <li key={detail} className="flex gap-2">
                      <span className="text-[#b8893a]">✦</span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </details>
              <details className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-medium uppercase tracking-[0.2em]">
                  Shipping & returns
                  <span className="text-lg transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-4 leading-7 text-black/65">
                  Free standard shipping from {formatPrice(FREE_SHIPPING_FROM)}, delivered in 2–4
                  working days. Express delivery available at checkout. Returns are free within
                  30 days.
                </p>
              </details>
            </div>
          </div>
        </div>
      </div>

      <ProductCarousel eyebrow="Complete the look" title="You may also like" products={related} />
    </main>
  )
}

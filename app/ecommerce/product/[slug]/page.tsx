import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ProductCard from '../../_components/product-card'
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
  ].slice(0, 4)

  return (
    <main className="mx-auto max-w-7xl px-5 py-8 md:px-8">
      <nav aria-label="Breadcrumb" className="text-sm text-black/50">
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

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div className="overflow-hidden rounded-[2rem] bg-[#ebe4da]">
          <Image
            priority
            width={1000}
            height={1250}
            sizes="(min-width: 1024px) 55vw, 100vw"
            src={product.image}
            alt={product.name}
            className="aspect-[4/5] w-full object-cover"
          />
        </div>

        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-[#8c6a2f]">
            {product.tag}
          </p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight md:text-5xl">{product.name}</h1>
          <div className="mt-4 flex items-center gap-4">
            <p className="text-2xl">{formatPrice(product.price)}</p>
            <p className="text-sm text-black/55">
              <span className="text-[#8c6a2f]" aria-hidden="true">★</span> {product.rating} ·{' '}
              {product.reviews} reviews
            </p>
          </div>
          <p className="mt-6 text-lg leading-8 text-black/65">{product.description}</p>
          <p className="mt-4 text-sm text-black/55">
            Colour: <span className="text-black">{product.color}</span>
          </p>

          <PurchasePanel product={product} />

          <div className="mt-8 divide-y divide-black/10 border-y border-black/10">
            <details open className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                Details
                <span className="transition group-open:rotate-45">+</span>
              </summary>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-black/65">
                {product.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            </details>
            <details className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                Shipping & returns
                <span className="transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 leading-7 text-black/65">
                Free standard shipping from {formatPrice(FREE_SHIPPING_FROM)}, delivered in 2–4
                working days. Express delivery available at checkout. Returns are free within 30
                days.
              </p>
            </details>
          </div>
        </div>
      </div>

      <section className="mt-24">
        <h2 className="text-2xl font-semibold">You may also like</h2>
        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
          {related.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>
    </main>
  )
}

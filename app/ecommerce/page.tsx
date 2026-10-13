import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'
import Catalog from './_components/catalog'
import { categories, FREE_SHIPPING_FROM, formatPrice, products } from './_lib/products'

const perks = [
  { title: `Free shipping from ${formatPrice(FREE_SHIPPING_FROM)}`, text: 'Delivered in 2–4 working days' },
  { title: '30-day returns', text: 'Free and easy, no questions asked' },
  { title: 'Secure checkout', text: 'Card details never leave your device' },
]

export default function StorePage() {
  return (
    <main>
      <section className="mx-auto grid max-w-7xl gap-10 px-5 pb-16 pt-10 md:px-8 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:pt-16">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-[#8c6a2f]">
            Autumn edit 2026
          </p>
          <h1 className="mt-5 text-5xl font-semibold leading-[1.05] md:text-7xl">
            Considered essentials for every day.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-8 text-black/60">
            Bags, shoes and pieces made to be worn often and kept for years.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="#catalog"
              className="rounded-full bg-[#171412] px-7 py-3.5 text-sm font-medium text-white transition hover:bg-black"
            >
              Shop the edit
            </Link>
            <Link
              href="?category=Bags#catalog"
              className="rounded-full border border-black/15 px-7 py-3.5 text-sm font-medium transition hover:border-black/40"
            >
              Explore bags
            </Link>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-[2rem]">
          <Image
            priority
            width={1400}
            height={1000}
            sizes="(min-width: 1024px) 55vw, 100vw"
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1400&auto=format&fit=crop"
            alt="Bright store interior with clothing rails"
            className="aspect-[4/3] w-full object-cover"
          />
        </div>
      </section>

      <section aria-label="Shop by category" className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {categories.map((category) => {
            const cover = products.find((product) => product.category === category)!

            return (
              <Link
                key={category}
                href={`?category=${category}#catalog`}
                className="group relative overflow-hidden rounded-2xl"
              >
                <Image
                  width={600}
                  height={600}
                  sizes="(min-width: 768px) 25vw, 50vw"
                  src={cover.image}
                  alt=""
                  className="aspect-square w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <p className="absolute bottom-4 left-4 text-lg font-medium text-white">
                  {category} →
                </p>
              </Link>
            )
          })}
        </div>
      </section>

      <Suspense>
        <Catalog />
      </Suspense>

      <section className="border-t border-black/10 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 md:grid-cols-3 md:px-8">
          {perks.map((perk) => (
            <div key={perk.title}>
              <p className="font-medium">{perk.title}</p>
              <p className="mt-1 text-sm text-black/55">{perk.text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

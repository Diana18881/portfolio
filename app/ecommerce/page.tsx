import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'
import Catalog from './_components/catalog'
import { ArrowRight } from './_components/icons'
import ProductCarousel from './_components/product-carousel'
import Showroom3D from './_components/showroom-3d'
import StoreHero from './_components/store-hero'
import { categories, FREE_SHIPPING_FROM, formatPrice, products } from './_lib/products'

const marquee = [
  `Free shipping from ${formatPrice(FREE_SHIPPING_FROM)}`,
  '30-day free returns',
  'Handmade leather goods',
  'Gold vermeil jewellery',
  'Use code LUMA10 for 10% off',
]

const categoryCovers: Record<string, number> = { Bags: 2, Shoes: 7, Accessories: 11, Clothing: 15 }

const perks = [
  { title: `Free shipping from ${formatPrice(FREE_SHIPPING_FROM)}`, text: 'Delivered in 2–4 working days across the EU.' },
  { title: '30-day returns', text: 'Free and easy, no questions asked.' },
  { title: 'Made to last', text: 'Natural materials, honest construction, repair service.' },
  { title: 'Secure checkout', text: 'Card details never leave your device in this demo.' },
]

export default function StorePage() {
  const newArrivals = products.filter((product) =>
    ['New in', 'Autumn edit', 'Handmade', 'Best seller'].includes(product.tag),
  )

  return (
    <main>
      <StoreHero />

      <div className="mt-8 overflow-hidden border-y border-black/[0.08] py-4" aria-hidden="true">
        <div className="flex w-max motion-safe:animate-[marquee_40s_linear_infinite]">
          {[...marquee, ...marquee].map((item, index) => (
            <span key={index} className="flex items-center gap-8 pr-8 font-display text-2xl italic text-black/70">
              {item}
              <span className="text-[#b8893a]">✦</span>
            </span>
          ))}
        </div>
      </div>

      <section aria-label="Shop by category" className="reveal mx-auto max-w-7xl px-5 pt-16 md:px-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
          {categories.map((category, index) => {
            const cover = products.find((product) => product.id === categoryCovers[category])!
            const count = products.filter((product) => product.category === category).length

            return (
              <Link
                key={category}
                href={`?category=${category}#catalog`}
                className={`group relative overflow-hidden rounded-[1.5rem] ${index % 2 ? 'md:mt-12' : ''}`}
              >
                <Image
                  width={700}
                  height={900}
                  sizes="(min-width: 768px) 25vw, 50vw"
                  src={cover.images[0]}
                  alt=""
                  className="aspect-[4/5] w-full object-cover transition duration-[1200ms] ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute inset-x-5 bottom-5 flex items-end justify-between text-white">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-white/70">{count} pieces</p>
                    <p className="mt-1 font-display text-3xl">{category}</p>
                  </div>
                  <span className="grid h-10 w-10 place-items-center rounded-full border border-white/40 backdrop-blur-md transition group-hover:bg-white group-hover:text-black">
                    <ArrowRight className="h-4 w-4 transition group-hover:-rotate-45" />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      <ProductCarousel eyebrow="Just landed" title="New arrivals" products={newArrivals} />

      <Showroom3D />

      <section className="reveal mx-auto grid max-w-7xl gap-10 px-5 py-24 md:grid-cols-2 md:items-center md:px-8">
        <div className="relative">
          <Image
            width={900}
            height={1100}
            sizes="(min-width: 768px) 50vw, 100vw"
            src={products.find((product) => product.id === 7)!.images[0]}
            alt="Cognac brogue boots"
            className="aspect-[4/5] w-full rounded-[2rem] object-cover"
          />
          <div className="absolute -bottom-6 right-6 rounded-[1.5rem] bg-[#171412] p-6 text-white shadow-2xl md:-right-8">
            <p className="font-display text-5xl">120+</p>
            <p className="mt-1 text-sm text-white/60">hand-finished steps per pair</p>
          </div>
        </div>
        <div className="md:pl-10">
          <p className="text-xs uppercase tracking-[0.4em] text-[#8c6a2f]">The craft</p>
          <h2 className="mt-4 font-display text-5xl font-medium leading-tight md:text-6xl">
            Slow made, <em>long</em> worn.
          </h2>
          <p className="mt-6 max-w-md text-lg leading-8 text-black/60">
            Our leather goods are cut, stitched and burnished in small family workshops. Every
            piece can be repaired, so it only gets better with time.
          </p>
          <dl className="mt-10 grid max-w-md grid-cols-3 gap-6 border-t border-black/10 pt-8">
            {[
              ['12', 'workshops'],
              ['4.8★', 'avg. rating'],
              ['10 yr', 'repair promise'],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="sr-only">{label}</dt>
                <dd className="font-display text-3xl">{value}</dd>
                <dd className="mt-1 text-xs uppercase tracking-[0.15em] text-black/50">{label}</dd>
              </div>
            ))}
          </dl>
          <Link
            href="?category=Shoes#catalog"
            className="group mt-10 inline-flex items-center gap-3 rounded-full bg-[#171412] px-7 py-4 text-sm font-medium text-white transition hover:bg-black"
          >
            Discover shoes
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      <Suspense>
        <Catalog />
      </Suspense>

      <section className="border-t border-black/[0.08] bg-white/60">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:grid-cols-2 md:px-8 lg:grid-cols-4">
          {perks.map((perk, index) => (
            <div key={perk.title}>
              <p className="font-display text-2xl text-[#b8893a]">0{index + 1}</p>
              <p className="mt-2 font-medium">{perk.title}</p>
              <p className="mt-1 text-sm leading-6 text-black/55">{perk.text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

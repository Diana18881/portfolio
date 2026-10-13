import type { Metadata } from 'next'
import { Cormorant_Garamond } from 'next/font/google'
import Link from 'next/link'
import CartDrawer from './_components/cart-drawer'
import Logo from './_components/logo'
import QuickView from './_components/quick-view'
import StoreHeader from './_components/store-header'
import Toast from './_components/toast'
import { categories } from './_lib/products'

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
})

export const metadata: Metadata = {
  title: {
    default: 'Luma — E-commerce Platform',
    template: '%s · Luma',
  },
  description:
    'Demo store: 3D showroom, quick view, product galleries, persistent bag and multi-step checkout. Orders show up live in the dashboard case.',
}

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${cormorant.variable} min-h-screen bg-[#f6f1ea] text-[#171412]`}>
      <StoreHeader />
      {children}
      <footer className="bg-[#14110f] text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-[1.4fr_1fr_1fr] md:px-8">
          <div>
            <Logo />
            <p className="mt-6 max-w-xs text-sm leading-6 text-white/55">
              Considered essentials, made slowly. A demo store, no real payments are taken.
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">Shop</p>
            <ul className="mt-5 space-y-3 text-sm text-white/75">
              {categories.map((category) => (
                <li key={category}>
                  <Link href={`/ecommerce?category=${category}#catalog`} className="hover:text-white">
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">This project</p>
            <ul className="mt-5 space-y-3 text-sm text-white/75">
              <li>
                <Link href="/dashboard" className="hover:text-white">
                  Dashboard case →
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white">
                  Portfolio of Diana Tsymbaliuk
                </Link>
              </li>
              <li className="text-white/45">Next.js · React · TypeScript · Tailwind CSS</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10">
          <p className="mx-auto max-w-7xl px-5 py-6 text-xs text-white/40 md:px-8">
            Designed and built by Diana Tsymbaliuk. Product photos from Unsplash.
          </p>
        </div>
      </footer>
      <CartDrawer />
      <QuickView />
      <Toast />
    </div>
  )
}

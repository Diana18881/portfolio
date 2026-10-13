import type { Metadata } from 'next'
import Link from 'next/link'
import CartDrawer from './_components/cart-drawer'
import StoreHeader from './_components/store-header'

export const metadata: Metadata = {
  title: {
    default: 'Luma — E-commerce Platform',
    template: '%s · Luma',
  },
  description:
    'Demo store: product catalog with URL filters, product pages, persistent bag and multi-step checkout. Orders show up live in the dashboard case.',
}

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f7f3ed] text-[#171412]">
      <StoreHeader />
      {children}
      <footer className="border-t border-black/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-10 text-sm text-black/55 md:flex-row md:justify-between md:px-8">
          <p>
            <span className="font-semibold tracking-[0.3em] text-black">LUMA</span> · Demo store,
            no real payments.
          </p>
          <p>
            Designed and built by{' '}
            <Link href="/" className="text-black underline-offset-4 hover:underline">
              Diana Tsymbaliuk
            </Link>{' '}
            · Next.js, React, TypeScript, Tailwind CSS
          </p>
        </div>
      </footer>
      <CartDrawer />
    </div>
  )
}

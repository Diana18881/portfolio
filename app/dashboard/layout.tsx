import type { Metadata } from 'next'
import { Cormorant_Garamond } from 'next/font/google'

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
})

export const metadata: Metadata = {
  title: 'Dashboard System',
  description:
    'Admin dashboard for the Luma demo store: revenue, best sellers, shopping times and orders, with live orders from the e-commerce case.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className={cormorant.variable}>{children}</div>
}

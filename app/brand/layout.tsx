import type { Metadata } from 'next'
import { Cormorant_Garamond } from 'next/font/google'

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
})

export const metadata: Metadata = {
  title: 'Maison Verde — Brand Website',
  description:
    'Restaurant website in English and German with signature dishes, menu, gallery and a three-step table booking, plus a reservation admin.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className={cormorant.variable}>{children}</div>
}

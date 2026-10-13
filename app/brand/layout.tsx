import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Maison Verde — Brand Website',
  description: 'Restaurant website with menu, gallery and table reservations managed in an admin view.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

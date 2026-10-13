import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'E-commerce Platform',
  description: 'Product catalog, filters, cart and checkout flow. Orders show up live in the dashboard case.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

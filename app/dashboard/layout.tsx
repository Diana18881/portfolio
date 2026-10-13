import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard System',
  description: 'Analytics dashboard with charts, tables and filters, fed by orders placed in the e-commerce case.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

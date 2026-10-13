import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Maison Verde — Reservations Admin',
  description: 'Admin view for managing restaurant reservations and table status.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

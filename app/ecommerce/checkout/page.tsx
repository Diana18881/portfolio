import type { Metadata } from 'next'
import CheckoutFlow from '../_components/checkout-flow'

export const metadata: Metadata = { title: 'Checkout' }

export default function CheckoutPage() {
  return <CheckoutFlow />
}

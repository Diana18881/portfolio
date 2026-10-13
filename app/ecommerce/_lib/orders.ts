// Shared with the dashboard case, which reads these orders and shows them live.
export const ORDERS_STORAGE_KEY = 'portfolio-commerce-orders'

export type PortfolioOrderLine = {
  productId: number
  size: string
  quantity: number
  price: number
}

export type PortfolioOrder = {
  id: string
  customer: string
  email: string
  product: string
  status: 'Paid'
  revenue: number
  channel: string
  date: string
  items: number
  // Added later; older saved orders may not have these.
  createdAt?: string
  city?: string
  lines?: PortfolioOrderLine[]
}

export const saveOrder = (order: PortfolioOrder) => {
  const existing = JSON.parse(
    window.localStorage.getItem(ORDERS_STORAGE_KEY) || '[]',
  ) as PortfolioOrder[]

  window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify([order, ...existing].slice(0, 12)))
}

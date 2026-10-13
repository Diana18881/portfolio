// Shared with app/dashboard/page.tsx, which reads these orders to show live revenue.
const ORDERS_STORAGE_KEY = 'portfolio-commerce-orders'

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
}

export const saveOrder = (order: PortfolioOrder) => {
  const existing = JSON.parse(
    window.localStorage.getItem(ORDERS_STORAGE_KEY) || '[]',
  ) as PortfolioOrder[]

  window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify([order, ...existing].slice(0, 12)))
}

import { ORDERS_STORAGE_KEY, type PortfolioOrder } from '../../ecommerce/_lib/orders'
import { categories, getProductById, products, type Category } from '../../ecommerce/_lib/products'

export type OrderStatus = 'Pending' | 'Paid' | 'Shipped' | 'Delivered' | 'Refunded'

export type OrderLine = {
  productId: number
  size: string
  quantity: number
  price: number
}

export type Order = {
  id: string
  createdAt: Date
  customer: string
  email: string
  city: string
  channel: string
  lines: OrderLine[]
  total: number
  status: OrderStatus
  live: boolean
}

export const RANGES = [7, 30, 90] as const
export type Range = (typeof RANGES)[number]

export const CATEGORY_COLORS: Record<Category, string> = {
  Bags: '#b07a12',
  Shoes: '#009485',
  Accessories: '#c2492e',
  Clothing: '#4069c4',
}

export const CHANNELS = ['Organic search', 'Instagram', 'Email', 'Paid search', 'Direct'] as const

const firstNames = ['Mia', 'Jonas', 'Lea', 'Noah', 'Emma', 'Paul', 'Hanna', 'Felix', 'Clara', 'Leon', 'Sofia', 'Elias', 'Lina', 'Ben', 'Marie', 'Luis', 'Ella', 'Finn', 'Anna', 'Theo']
const lastNames = ['Schneider', 'Weber', 'Hoffmann', 'Richter', 'Fischer', 'Wagner', 'Becker', 'Schulz', 'Koch', 'Bauer', 'Klein', 'Wolf', 'Neumann', 'Braun', 'Zimmermann', 'Hartmann']
const cities = ['Berlin', 'Hamburg', 'München', 'Köln', 'Frankfurt', 'Wien', 'Zürich', 'Leipzig']

// Small deterministic PRNG so the same calendar day always produces the same orders.
const mulberry32 = (seed: number) => () => {
  seed |= 0
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

const hash = (text: string) => {
  let value = 2166136261
  for (let index = 0; index < text.length; index += 1) {
    value ^= text.charCodeAt(index)
    value = Math.imul(value, 16777619)
  }
  return value >>> 0
}

const pick = <T,>(random: () => number, items: readonly T[], weights?: number[]) => {
  if (!weights) return items[Math.floor(random() * items.length)]
  const total = weights.reduce((sum, weight) => sum + weight, 0)
  let roll = random() * total
  for (let index = 0; index < items.length; index += 1) {
    roll -= weights[index]
    if (roll <= 0) return items[index]
  }
  return items[items.length - 1]
}

export const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())

export const addDays = (date: Date, days: number) => {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

const dayKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

const statusForAge = (random: () => number, ageInDays: number): OrderStatus => {
  if (random() < 0.06) return 'Refunded'
  if (ageInDays === 0) return random() < 0.35 ? 'Pending' : 'Paid'
  if (ageInDays <= 2) return random() < 0.5 ? 'Paid' : 'Shipped'
  if (ageInDays <= 4) return random() < 0.4 ? 'Shipped' : 'Delivered'
  return 'Delivered'
}

const productWeights = products.map((product) => 260 - product.price + (product.tag === 'Best seller' ? 80 : 0))

export const generateOrders = (today: Date, days = 180): Order[] => {
  const orders: Order[] = []
  const end = startOfDay(today)

  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const day = addDays(end, -offset)
    const random = mulberry32(hash(dayKey(day)))
    const weekday = day.getDay()
    const weekendBoost = weekday === 0 || weekday === 6 ? 4 : weekday === 5 ? 2 : 0
    const trend = ((days - offset) / days) * 4
    const count = Math.max(3, Math.round(7 + trend + weekendBoost + (random() - 0.5) * 6))
    // Today only has the orders placed "so far".
    const visible = offset === 0 ? Math.max(1, Math.round(count * Math.min(today.getHours() / 22, 1))) : count

    for (let index = 0; index < visible; index += 1) {
      const hour = pick(random, [8, 10, 12, 13, 15, 17, 19, 20, 21, 22, 23, 6], [3, 5, 8, 8, 6, 6, 9, 11, 10, 7, 4, 1])
      const createdAt = new Date(day)
      createdAt.setHours(hour, Math.floor(random() * 60))
      if (offset === 0 && createdAt > today) createdAt.setTime(today.getTime() - (index + 1) * 600000)

      const lineCount = pick(random, [1, 2, 3], [70, 24, 6])
      const lines: OrderLine[] = []
      for (let line = 0; line < lineCount; line += 1) {
        const product = pick(random, products, productWeights)
        if (lines.some((item) => item.productId === product.id)) continue
        lines.push({ productId: product.id, size: pick(random, product.sizes), quantity: 1, price: product.price })
      }

      const first = pick(random, firstNames)
      const last = pick(random, lastNames)
      const subtotal = lines.reduce((sum, line) => sum + line.price * line.quantity, 0)
      const discounted = random() < 0.15 ? Math.round(subtotal * 0.9) : subtotal

      orders.push({
        id: `#LM-${String(hash(`${dayKey(day)}-${index}`) % 90000 + 10000)}`,
        createdAt,
        customer: `${first} ${last}`,
        email: `${first}.${last}@example.com`.toLowerCase(),
        city: pick(random, cities),
        channel: pick(random, CHANNELS, [34, 24, 16, 14, 12]),
        lines,
        total: discounted,
        status: statusForAge(random, offset),
        live: false,
      })
    }
  }

  return orders
}

const productByName = (name: string) => products.find((product) => product.name === name)

// Orders placed in the e-commerce case, read from localStorage.
export const readLiveOrders = (): Order[] => {
  try {
    const saved = JSON.parse(window.localStorage.getItem(ORDERS_STORAGE_KEY) || '[]') as PortfolioOrder[]

    return saved.map((order) => {
      const lines =
        order.lines ??
        order.product.split(', ').flatMap((part) => {
          const match = /^(\d+)x (.+)$/.exec(part)
          const product = match ? productByName(match[2]) : undefined
          return product
            ? [{ productId: product.id, size: product.sizes[0], quantity: Number(match![1]), price: product.price }]
            : []
        })

      return {
        id: order.id,
        createdAt: order.createdAt ? new Date(order.createdAt) : new Date(),
        customer: order.customer,
        email: order.email,
        city: order.city || 'Online',
        channel: 'Luma store (live)',
        lines,
        total: order.revenue,
        status: 'Paid' as const,
        live: true,
      }
    })
  } catch {
    return []
  }
}

export const clearLiveOrders = () => window.localStorage.removeItem(ORDERS_STORAGE_KEY)

export const isCounted = (order: Order) => order.status !== 'Refunded'

export const ordersBetween = (orders: Order[], from: Date, to: Date) =>
  orders.filter((order) => order.createdAt >= from && order.createdAt < to)

export type Period = { from: Date; to: Date; previousFrom: Date }

export const periodFor = (today: Date, range: Range): Period => {
  const to = addDays(startOfDay(today), 1)
  const from = addDays(to, -range)
  return { from, to, previousFrom: addDays(from, -range) }
}

export const summarize = (orders: Order[]) => {
  const counted = orders.filter(isCounted)
  const revenue = counted.reduce((sum, order) => sum + order.total, 0)

  return {
    revenue,
    orders: orders.length,
    averageOrder: counted.length ? revenue / counted.length : 0,
    customers: new Set(orders.map((order) => order.email)).size,
  }
}

export const dailySeries = (orders: Order[], from: Date, days: number) => {
  const series = Array.from({ length: days }, (_, index) => ({
    date: addDays(from, index),
    revenue: 0,
    orders: 0,
  }))

  orders.forEach((order) => {
    const index = Math.floor((startOfDay(order.createdAt).getTime() - from.getTime()) / 86400000)
    const point = series[index]
    if (!point) return
    point.orders += 1
    if (isCounted(order)) point.revenue += order.total
  })

  return series
}

export const revenueByCategory = (orders: Order[]) => {
  const totals = Object.fromEntries(categories.map((category) => [category, 0])) as Record<Category, number>

  orders.filter(isCounted).forEach((order) =>
    order.lines.forEach((line) => {
      const product = getProductById(line.productId)
      if (product) totals[product.category] += line.price * line.quantity
    }),
  )

  return categories.map((category) => ({ category, revenue: totals[category] }))
}

export const topProducts = (orders: Order[], limit = 5) => {
  const totals = new Map<number, { units: number; revenue: number }>()

  orders.filter(isCounted).forEach((order) =>
    order.lines.forEach((line) => {
      const current = totals.get(line.productId) ?? { units: 0, revenue: 0 }
      totals.set(line.productId, {
        units: current.units + line.quantity,
        revenue: current.revenue + line.price * line.quantity,
      })
    }),
  )

  return [...totals.entries()]
    .map(([productId, value]) => ({ product: getProductById(productId)!, ...value }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit)
}

export const TIME_SLOTS = ['6–9', '9–12', '12–15', '15–18', '18–21', '21–24'] as const
export const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const

export const ordersHeatmap = (orders: Order[]) => {
  const grid = WEEKDAYS.map(() => TIME_SLOTS.map(() => 0))

  orders.forEach((order) => {
    const weekday = (order.createdAt.getDay() + 6) % 7
    const slot = Math.min(Math.max(Math.floor((order.createdAt.getHours() - 6) / 3), 0), TIME_SLOTS.length - 1)
    grid[weekday][slot] += 1
  })

  return grid
}

export const channelShare = (orders: Order[]) => {
  const counts = new Map<string, number>()
  orders.forEach((order) => counts.set(order.channel, (counts.get(order.channel) ?? 0) + 1))

  return [...counts.entries()]
    .map(([channel, count]) => ({ channel, count, share: orders.length ? count / orders.length : 0 }))
    .sort((a, b) => b.count - a.count)
}

export const change = (current: number, previous: number) =>
  previous ? (current - previous) / previous : current ? 1 : 0

const euro = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
const compactEuro = new Intl.NumberFormat('en-IE', {
  style: 'currency',
  currency: 'EUR',
  notation: 'compact',
  maximumFractionDigits: 1,
})

export const formatEuro = (value: number) => euro.format(value)
export const formatCompactEuro = (value: number) => compactEuro.format(value)
export const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`
export const formatDay = (date: Date) =>
  date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
export const formatDateTime = (date: Date) =>
  date.toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

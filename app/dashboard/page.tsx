'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

type OrderStatus = 'Paid' | 'Pending' | 'Refunded'

type Order = {
  id: string
  customer: string
  product: string
  status: OrderStatus
  revenue: number
  channel: string
  date: string
  email?: string
  items?: number
}

const ORDERS_STORAGE_KEY = 'portfolio-commerce-orders'
const baseWeeklyRevenue = [34, 42, 38, 56, 51, 68, 74]

const orders: Order[] = [
  {
    id: '#1048',
    customer: 'Mia Schneider',
    product: 'Noir Leather Tote',
    status: 'Paid',
    revenue: 189,
    channel: 'Organic',
    date: 'Today',
  },
  {
    id: '#1047',
    customer: 'Jonas Weber',
    product: 'Cloud Runner Sneaker',
    status: 'Pending',
    revenue: 142,
    channel: 'Paid search',
    date: 'Today',
  },
  {
    id: '#1046',
    customer: 'Lea Hoffmann',
    product: 'Soft Gold Watch',
    status: 'Paid',
    revenue: 96,
    channel: 'Email',
    date: 'Yesterday',
  },
  {
    id: '#1045',
    customer: 'Noah Richter',
    product: 'Minimal Crossbody',
    status: 'Refunded',
    revenue: 128,
    channel: 'Social',
    date: 'Yesterday',
  },
  {
    id: '#1044',
    customer: 'Emma Fischer',
    product: 'City Low Sneaker',
    status: 'Paid',
    revenue: 118,
    channel: 'Organic',
    date: '2 days ago',
  },
]

const statuses = ['All', 'Paid', 'Pending', 'Refunded'] as const

export default function DashboardPage() {
  const [status, setStatus] = useState<(typeof statuses)[number]>('All')
  const [query, setQuery] = useState('')
  const [liveOrders, setLiveOrders] = useState<Order[]>([])

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      const storedOrders = JSON.parse(
        window.localStorage.getItem(ORDERS_STORAGE_KEY) || '[]',
      ) as Order[]

      setLiveOrders(storedOrders)
    })

    return () => window.cancelAnimationFrame(frameId)
  }, [])

  const clearLiveOrders = () => {
    window.localStorage.removeItem(ORDERS_STORAGE_KEY)
    setLiveOrders([])
  }

  const allOrders = useMemo(() => [...liveOrders, ...orders], [liveOrders])

  const totalRevenue = allOrders.reduce((total, order) => total + order.revenue, 0)
  const refundedOrders = allOrders.filter((order) => order.status === 'Refunded').length
  const conversionRate = Math.min(12.4, 5.6 + liveOrders.length * 0.4)
  const refundRate = allOrders.length ? (refundedOrders / allOrders.length) * 100 : 0

  const metrics = [
    {
      label: 'Revenue',
      value: `€${totalRevenue.toLocaleString('en-US')}`,
      change: liveOrders.length ? `+€${liveOrders.reduce((total, order) => total + order.revenue, 0)}` : '+18.4%',
    },
    {
      label: 'Orders',
      value: allOrders.length.toLocaleString('en-US'),
      change: liveOrders.length ? `+${liveOrders.length} live` : '+9.7%',
    },
    {
      label: 'Conversion',
      value: `${conversionRate.toFixed(1)}%`,
      change: `+${(conversionRate - 5.6).toFixed(1)}%`,
    },
    {
      label: 'Refunds',
      value: `${refundRate.toFixed(1)}%`,
      change: refundedOrders ? '-0.4%' : '0 active',
    },
  ]

  const weeklyRevenue = [
    ...baseWeeklyRevenue.slice(0, 6),
    baseWeeklyRevenue[6] + liveOrders.reduce((total, order) => total + order.revenue, 0) / 10,
  ]

  const channelCounts = allOrders.reduce<Record<string, number>>((acc, order) => {
    const channel = order.channel.replace('Paid search', 'Paid')
    acc[channel] = (acc[channel] || 0) + 1
    return acc
  }, {})

  const channelData = Object.entries(channelCounts).map(([label, value]) => ({
    label,
    value: Math.round((value / allOrders.length) * 100),
  }))

  const filteredOrders = useMemo(() => {
    return allOrders.filter((order) => {
      const matchesStatus = status === 'All' || order.status === status
      const searchable = `${order.customer} ${order.product} ${order.channel} ${
        order.email || ''
      }`.toLowerCase()
      const matchesQuery = searchable.includes(query.toLowerCase())

      return matchesStatus && matchesQuery
    })
  }, [allOrders, query, status])

  const maxRevenue = Math.max(...weeklyRevenue)

  return (
    <main className="min-h-screen bg-[#101312] text-white">
      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-6 md:px-10 lg:grid-cols-[240px_1fr] lg:px-14">
        <aside className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)]">
          <Link href="/" className="text-sm font-semibold uppercase tracking-[0.25em]">
            Diana Tsymbaliuk
          </Link>
          <nav className="mt-10 grid gap-2 text-sm text-white/65">
            <a href="#overview" className="rounded-full bg-white px-4 py-3 font-medium text-black">
              Overview
            </a>
            <a href="#analytics" className="rounded-full px-4 py-3 hover:bg-white/10">
              Analytics
            </a>
            <a href="#orders" className="rounded-full px-4 py-3 hover:bg-white/10">
              Orders
            </a>
            <Link href="/ecommerce" className="rounded-full px-4 py-3 hover:bg-white/10">
              E-commerce case
            </Link>
          </nav>
          <div className="mt-10 rounded-[1.25rem] bg-[#d4af37] p-4 text-black">
            <p className="font-semibold">Case focus</p>
            <p className="mt-2 text-sm leading-6 text-black/70">
              KPI cards update from orders created in the e-commerce checkout.
            </p>
          </div>
        </aside>

        <section className="space-y-6">
          <header id="overview" className="rounded-[2rem] bg-[#f5f1ea] p-6 text-[#171412] md:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#8c6a2f]">
                  Dashboard case study
                </p>
                <h1 className="mt-5 text-5xl font-semibold leading-none md:text-7xl">
                  Commerce Control
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-black/65">
                  A component-based analytics dashboard for tracking revenue,
                  orders, customer activity and operational scenarios from the
                  connected e-commerce checkout.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <span className="rounded-full border border-black/10 px-4 py-2">React</span>
                <span className="rounded-full border border-black/10 px-4 py-2">TypeScript</span>
                <span className="rounded-full border border-black/10 px-4 py-2">Tables</span>
                <span className="rounded-full border border-black/10 px-4 py-2">Charts</span>
              </div>
            </div>
          </header>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => (
              <article key={metric.label} className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5">
                <p className="text-sm text-white/55">{metric.label}</p>
                <div className="mt-4 flex items-end justify-between">
                  <p className="text-3xl font-semibold">{metric.value}</p>
                  <span className="rounded-full bg-[#d4af37]/15 px-3 py-1 text-sm text-[#d4af37]">
                    {metric.change}
                  </span>
                </div>
              </article>
            ))}
          </div>

          <section id="analytics" className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
            <article className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-[#d4af37]">
                    Revenue trend
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold">Weekly performance</h2>
                </div>
                <span className="rounded-full bg-white/10 px-4 py-2 text-sm text-white/65">
                  Last 7 days
                </span>
              </div>

              <div className="mt-8 flex h-72 items-end gap-3 border-b border-white/10">
                {weeklyRevenue.map((value, index) => (
                  <div key={index} className="flex flex-1 flex-col items-center gap-3">
                    <div className="flex w-full items-end rounded-t-[1rem] bg-white/5">
                      <div
                        className="w-full rounded-t-[1rem] bg-[#d4af37]"
                        style={{ height: `${(value / maxRevenue) * 240}px` }}
                      />
                    </div>
                    <span className="text-xs text-white/45">D{index + 1}</span>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
              <p className="text-sm uppercase tracking-[0.3em] text-[#d4af37]">
                Channels
              </p>
              <h2 className="mt-2 text-2xl font-semibold">Acquisition mix</h2>
              <div className="mt-8 space-y-5">
                {channelData.map((channel) => (
                  <div key={channel.label}>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">{channel.label}</span>
                      <span>{channel.value}%</span>
                    </div>
                    <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-[#d4af37]"
                        style={{ width: `${channel.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <section id="orders" className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 md:p-6">
            <div className="flex flex-col gap-4 border-b border-white/10 pb-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-[#d4af37]">
                  Order management
                </p>
                <h2 className="mt-2 text-2xl font-semibold">Recent orders</h2>
              </div>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search customers or products"
                className="rounded-full border border-white/10 bg-black/20 px-5 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-white/35"
              />
            </div>

            {liveOrders.length ? (
              <div className="mt-5 flex flex-col gap-3 rounded-[1rem] bg-[#d4af37]/15 p-4 text-sm leading-6 text-[#d4af37] sm:flex-row sm:items-center sm:justify-between">
                <p>
                  {liveOrders.length} live checkout order{liveOrders.length > 1 ? 's' : ''} connected
                  from the e-commerce case.
                </p>
                <button
                  onClick={clearLiveOrders}
                  className="rounded-full border border-[#d4af37]/30 px-4 py-2 text-xs font-semibold"
                >
                  Clear live data
                </button>
              </div>
            ) : (
              <p className="mt-5 rounded-[1rem] bg-white/5 p-4 text-sm leading-6 text-white/55">
                Create an order in the e-commerce case to update this dashboard.
              </p>
            )}

            <div className="mt-5 flex flex-wrap gap-3">
              {statuses.map((item) => (
                <button
                  key={item}
                  onClick={() => setStatus(item)}
                  className={`rounded-full px-5 py-3 text-sm transition ${
                    status === item
                      ? 'bg-white text-black'
                      : 'bg-white/5 text-white/65 hover:text-white'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[760px] border-separate border-spacing-y-3 text-left text-sm">
                <thead className="text-white/45">
                  <tr>
                    <th className="px-4 font-medium">Order</th>
                    <th className="px-4 font-medium">Customer</th>
                    <th className="px-4 font-medium">Product</th>
                    <th className="px-4 font-medium">Channel</th>
                    <th className="px-4 font-medium">Status</th>
                    <th className="px-4 text-right font-medium">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="bg-black/25">
                      <td className="rounded-l-[1rem] px-4 py-4 font-medium">{order.id}</td>
                      <td className="px-4 py-4">{order.customer}</td>
                      <td className="px-4 py-4 text-white/65">{order.product}</td>
                      <td className="px-4 py-4 text-white/65">{order.channel}</td>
                      <td className="px-4 py-4">
                        <span className="rounded-full bg-white/10 px-3 py-1 text-xs">
                          {order.status}
                        </span>
                      </td>
                      <td className="rounded-r-[1rem] px-4 py-4 text-right font-semibold">
                        €{order.revenue}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </section>
      </div>
    </main>
  )
}

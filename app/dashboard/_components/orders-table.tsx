'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import { getProductById } from '../../ecommerce/_lib/products'
import { formatDateTime, formatEuro, type Order, type OrderStatus } from '../_lib/data'
import Panel from './panel'
import StatusPill from './status-pill'

const FILTERS: ('All' | OrderStatus)[] = ['All', 'Pending', 'Paid', 'Shipped', 'Delivered', 'Refunded']
const PAGE_SIZE = 8

type SortKey = 'date' | 'total'

const Thumbs = ({ order }: { order: Order }) => (
  <span className="flex -space-x-2">
    {order.lines.slice(0, 3).map((line) => {
      const product = getProductById(line.productId)
      return product ? (
        <Image
          key={line.productId}
          width={64}
          height={80}
          src={product.images[0]}
          alt=""
          className="h-9 w-7 rounded-md object-cover ring-2 ring-[#fffdf9]"
        />
      ) : null
    })}
  </span>
)

export default function OrdersTable({ orders, onOpen }: { orders: Order[]; onOpen: (order: Order) => void }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<{ key: SortKey; descending: boolean }>({ key: 'date', descending: true })
  const [page, setPage] = useState(0)

  const counts = useMemo(() => {
    const result: Record<string, number> = { All: orders.length }
    orders.forEach((order) => (result[order.status] = (result[order.status] ?? 0) + 1))
    return result
  }, [orders])

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    const result = orders.filter((order) => {
      if (filter !== 'All' && order.status !== filter) return false
      if (!normalized) return true
      const names = order.lines.map((line) => getProductById(line.productId)?.name ?? '').join(' ')
      return `${order.id} ${order.customer} ${order.email} ${order.city} ${names}`.toLowerCase().includes(normalized)
    })
    const direction = sort.descending ? -1 : 1
    return result.sort((a, b) =>
      sort.key === 'date'
        ? (a.createdAt.getTime() - b.createdAt.getTime()) * direction
        : (a.total - b.total) * direction,
    )
  }, [orders, filter, query, sort])

  const pageCount = Math.max(Math.ceil(filtered.length / PAGE_SIZE), 1)
  const currentPage = Math.min(page, pageCount - 1)
  const visible = filtered.slice(currentPage * PAGE_SIZE, currentPage * PAGE_SIZE + PAGE_SIZE)

  const toggleSort = (key: SortKey) => {
    setSort((current) => ({ key, descending: current.key === key ? !current.descending : true }))
    setPage(0)
  }

  const sortIcon = (key: SortKey) => (sort.key === key ? (sort.descending ? '↓' : '↑') : '↕')

  return (
    <Panel
      id="orders"
      title="Orders"
      description="Every order in the selected period. Click an order to see its details and update its status."
      actions={
        <label className="relative w-full sm:w-64">
          <span className="sr-only">Search orders</span>
          <svg viewBox="0 0 24 24" aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 fill-none stroke-black/40" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setPage(0)
            }}
            placeholder="Search name, product, order…"
            className="w-full rounded-full border border-black/10 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-black/40"
          />
        </label>
      }
    >
      <div role="group" aria-label="Filter by status" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {FILTERS.map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={filter === item}
            onClick={() => {
              setFilter(item)
              setPage(0)
            }}
            className={`shrink-0 rounded-full px-4 py-2 text-sm transition ${
              filter === item ? 'bg-[#171412] text-white' : 'bg-black/[0.04] text-black/65 hover:text-black'
            }`}
          >
            {item} <span className={filter === item ? 'text-white/60' : 'text-black/40'}>{counts[item] ?? 0}</span>
          </button>
        ))}
      </div>

      {/* Laptop and desktop: a real table */}
      <div className="mt-5 hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-[0.12em] text-black/45">
            <tr className="border-b border-black/[0.07]">
              <th className="py-3 pr-4 font-medium">Order</th>
              <th className="py-3 pr-4 font-medium" aria-sort={sort.key === 'date' ? (sort.descending ? 'descending' : 'ascending') : 'none'}>
                <button type="button" onClick={() => toggleSort('date')} className="inline-flex items-center gap-1 uppercase hover:text-black">
                  Date <span aria-hidden="true">{sortIcon('date')}</span>
                </button>
              </th>
              <th className="py-3 pr-4 font-medium">Customer</th>
              <th className="py-3 pr-4 font-medium">Items</th>
              <th className="hidden py-3 pr-4 font-medium xl:table-cell">Channel</th>
              <th className="py-3 pr-4 font-medium">Status</th>
              <th className="py-3 text-right font-medium" aria-sort={sort.key === 'total' ? (sort.descending ? 'descending' : 'ascending') : 'none'}>
                <button type="button" onClick={() => toggleSort('total')} className="inline-flex items-center gap-1 uppercase hover:text-black">
                  Total <span aria-hidden="true">{sortIcon('total')}</span>
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {visible.map((order) => (
              <tr
                key={order.id}
                onClick={() => onOpen(order)}
                className={`cursor-pointer border-b border-black/[0.05] transition hover:bg-[#f7f1e6] ${order.live ? 'bg-[#2e7d4f]/[0.05]' : ''}`}
              >
                <td className="py-3 pr-4">
                  <button type="button" onClick={(event) => { event.stopPropagation(); onOpen(order) }} className="font-medium hover:underline">
                    {order.id}
                  </button>
                  {order.live ? (
                    <span className="ml-2 rounded-full bg-[#2e7d4f] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">Live</span>
                  ) : null}
                </td>
                <td className="py-3 pr-4 whitespace-nowrap text-black/60">{formatDateTime(order.createdAt)}</td>
                <td className="py-3 pr-4">
                  <p className="font-medium">{order.customer}</p>
                  <p className="text-xs text-black/45">{order.city}</p>
                </td>
                <td className="py-3 pr-4"><Thumbs order={order} /></td>
                <td className="hidden py-3 pr-4 text-black/60 xl:table-cell">{order.channel}</td>
                <td className="py-3 pr-4"><StatusPill status={order.status} /></td>
                <td className="py-3 text-right font-semibold tabular-nums">{formatEuro(order.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Phones: cards instead of a wide table */}
      <ul className="mt-5 space-y-3 md:hidden">
        {visible.map((order) => (
          <li key={order.id}>
            <button
              type="button"
              onClick={() => onOpen(order)}
              className={`w-full rounded-2xl border p-4 text-left transition active:scale-[0.99] ${
                order.live ? 'border-[#2e7d4f]/30 bg-[#2e7d4f]/[0.05]' : 'border-black/[0.07] bg-white'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">
                    {order.customer}
                    {order.live ? <span className="ml-2 rounded-full bg-[#2e7d4f] px-2 py-0.5 text-[10px] font-semibold uppercase text-white">Live</span> : null}
                  </p>
                  <p className="mt-0.5 text-xs text-black/45">
                    {order.id} · {formatDateTime(order.createdAt)}
                  </p>
                </div>
                <p className="font-semibold tabular-nums">{formatEuro(order.total)}</p>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <Thumbs order={order} />
                <StatusPill status={order.status} />
              </div>
            </button>
          </li>
        ))}
      </ul>

      {!visible.length ? (
        <p className="mt-6 rounded-2xl bg-black/[0.03] p-8 text-center text-black/55">No orders match this search.</p>
      ) : null}

      <div className="mt-5 flex items-center justify-between gap-4 text-sm text-black/55">
        <p>
          {filtered.length ? currentPage * PAGE_SIZE + 1 : 0}–{Math.min((currentPage + 1) * PAGE_SIZE, filtered.length)} of {filtered.length}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setPage(currentPage - 1)}
            disabled={currentPage === 0}
            aria-label="Previous page"
            className="grid h-9 w-9 place-items-center rounded-full border border-black/10 transition hover:bg-[#171412] hover:text-white disabled:pointer-events-none disabled:opacity-30"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => setPage(currentPage + 1)}
            disabled={currentPage >= pageCount - 1}
            aria-label="Next page"
            className="grid h-9 w-9 place-items-center rounded-full border border-black/10 transition hover:bg-[#171412] hover:text-white disabled:pointer-events-none disabled:opacity-30"
          >
            ›
          </button>
        </div>
      </div>
    </Panel>
  )
}

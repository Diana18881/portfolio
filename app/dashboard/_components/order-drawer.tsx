'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { getProductById } from '../../ecommerce/_lib/products'
import { formatDateTime, formatEuro, type Order, type OrderStatus } from '../_lib/data'
import StatusPill from './status-pill'

const STEPS: OrderStatus[] = ['Pending', 'Paid', 'Shipped', 'Delivered']

const nextAction: Partial<Record<OrderStatus, { label: string; status: OrderStatus }>> = {
  Pending: { label: 'Mark as paid', status: 'Paid' },
  Paid: { label: 'Mark as shipped', status: 'Shipped' },
  Shipped: { label: 'Mark as delivered', status: 'Delivered' },
}

export default function OrderDrawer({
  order,
  onClose,
  onStatusChange,
}: {
  order: Order | null
  onClose: () => void
  onStatusChange: (order: Order, status: OrderStatus) => void
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (order && !dialog.open) dialog.showModal()
    if (!order && dialog.open) dialog.close()
  }, [order])

  const stepIndex = order ? STEPS.indexOf(order.status) : -1
  const subtotal = order ? order.lines.reduce((sum, line) => sum + line.price * line.quantity, 0) : 0
  const action = order ? nextAction[order.status] : undefined

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      aria-label={order ? `Order ${order.id}` : 'Order details'}
      className="m-0 ml-auto h-dvh max-h-none w-full max-w-md bg-[#f6f1ea] p-0 text-[#171412] backdrop:bg-[#14110f]/50 backdrop:backdrop-blur-sm open:motion-safe:animate-[drawer-in_0.45s_cubic-bezier(0.22,1,0.36,1)]"
    >
      {order ? (
        <div className="flex h-full flex-col">
          <div className="flex items-start justify-between gap-4 border-b border-black/[0.08] px-6 py-5">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-black/45">Order</p>
              <h2 className="mt-1 font-display text-3xl font-medium">{order.id}</h2>
              <div className="mt-2 flex items-center gap-2">
                <StatusPill status={order.status} />
                {order.live ? (
                  <span className="rounded-full bg-[#2e7d4f] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                    Live from store
                  </span>
                ) : null}
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close order details"
              className="grid h-10 w-10 place-items-center rounded-full text-xl transition hover:rotate-90 hover:bg-black/5"
            >
              ×
            </button>
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
            {order.status !== 'Refunded' ? (
              <ol className="grid grid-cols-4 gap-2" aria-label="Order progress">
                {STEPS.map((step, index) => (
                  <li key={step} className="text-center">
                    <span
                      className={`mx-auto block h-1.5 rounded-full ${index <= stepIndex ? 'bg-[#b07a12]' : 'bg-black/10'}`}
                    />
                    <span className={`mt-2 block text-[11px] ${index <= stepIndex ? 'font-medium text-black' : 'text-black/40'}`}>
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="rounded-xl bg-[#b3261e]/10 p-3 text-sm text-[#9a1f18]">This order was refunded and is excluded from revenue.</p>
            )}

            <section className="rounded-2xl bg-white p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-black/45">Customer</p>
              <p className="mt-2 font-medium">{order.customer}</p>
              <p className="text-sm text-black/55">{order.email}</p>
              <p className="text-sm text-black/55">
                {order.city} · via {order.channel}
              </p>
              <p className="mt-2 text-xs text-black/45">Placed {formatDateTime(order.createdAt)}</p>
            </section>

            <section>
              <p className="text-xs uppercase tracking-[0.16em] text-black/45">Items</p>
              <ul className="mt-3 divide-y divide-black/[0.06] rounded-2xl bg-white px-4">
                {order.lines.map((line) => {
                  const product = getProductById(line.productId)
                  if (!product) return null
                  return (
                    <li key={`${line.productId}-${line.size}`} className="flex items-center gap-3 py-3">
                      <Image width={96} height={120} src={product.images[0]} alt="" className="h-14 w-11 rounded-lg object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{product.name}</p>
                        <p className="text-xs text-black/45">
                          {line.size} · Qty {line.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-medium tabular-nums">{formatEuro(line.price * line.quantity)}</p>
                    </li>
                  )
                })}
              </ul>
              <dl className="mt-3 space-y-1 px-1 text-sm">
                <div className="flex justify-between text-black/55">
                  <dt>Items</dt>
                  <dd className="tabular-nums">{formatEuro(subtotal)}</dd>
                </div>
                {order.total !== subtotal ? (
                  <div className="flex justify-between text-black/55">
                    <dt>Discount & shipping</dt>
                    <dd className="tabular-nums">{formatEuro(order.total - subtotal)}</dd>
                  </div>
                ) : null}
                <div className="flex items-baseline justify-between pt-1">
                  <dt className="font-medium">Total paid</dt>
                  <dd className="font-display text-2xl font-semibold tabular-nums">{formatEuro(order.total)}</dd>
                </div>
              </dl>
            </section>
          </div>

          <div className="flex gap-3 border-t border-black/[0.08] px-6 py-5">
            {action ? (
              <button
                type="button"
                onClick={() => onStatusChange(order, action.status)}
                className="flex-1 rounded-full bg-[#171412] px-5 py-3 text-sm font-medium text-white transition hover:bg-black"
              >
                {action.label}
              </button>
            ) : null}
            {order.status !== 'Refunded' ? (
              <button
                type="button"
                onClick={() => onStatusChange(order, 'Refunded')}
                className="rounded-full border border-[#b3261e]/30 px-5 py-3 text-sm font-medium text-[#9a1f18] transition hover:bg-[#b3261e]/10"
              >
                Refund
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </dialog>
  )
}

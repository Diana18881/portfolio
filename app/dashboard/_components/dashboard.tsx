'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import Logo from '../../ecommerce/_components/logo'
import {
  RANGES,
  change,
  channelShare,
  dailySeries,
  formatEuro,
  generateOrders,
  ordersBetween,
  ordersHeatmap,
  periodFor,
  revenueByCategory,
  summarize,
  topProducts,
  type Order,
  type OrderStatus,
  type Range,
} from '../_lib/data'
import { resetLiveOrders, useLiveOrders } from '../_lib/use-live-orders'
import CategoryBars from './category-bars'
import Channels from './channels'
import Heatmap from './heatmap'
import KpiCard from './kpi-card'
import OrderDrawer from './order-drawer'
import OrdersTable from './orders-table'
import RevenueChart, { Segmented } from './revenue-chart'
import TopProducts from './top-products'

const SECTIONS = [
  { id: 'overview', label: 'Overview', icon: 'M3 12h4v8H3zM10 4h4v16h-4zM17 9h4v11h-4z' },
  { id: 'sales', label: 'Sales', icon: 'M3 17l5-5 4 4 8-8M15 8h5v5' },
  { id: 'products', label: 'Products', icon: 'M5 8h14l-1 12H6L5 8ZM9 8V6a3 3 0 0 1 6 0v2' },
  { id: 'orders', label: 'Orders', icon: 'M5 4h14v16H5zM9 9h6M9 13h6M9 17h3' },
]

const TOUR_VIDEO = '/dashboard-tour.mp4'
const TOUR_POSTER = '/dashboard-tour-poster.jpg'
const INTRO_KEY = 'dashboard-intro-dismissed'

const subscribeNothing = () => () => {}
const useHydrated = () => useSyncExternalStore(subscribeNothing, () => true, () => false)

const Icon = ({ path, className = 'h-[18px] w-[18px]' }: { path: string; className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={`${className} fill-none stroke-current`} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d={path} />
  </svg>
)

export default function Dashboard() {
  const hydrated = useHydrated()
  const [today] = useState(() => new Date())
  const [range, setRange] = useState<Range>(30)
  const [overrides, setOverrides] = useState<Record<string, OrderStatus>>({})
  const [openOrderId, setOpenOrderId] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState('overview')
  const [introHidden, setIntroHidden] = useState(false)
  const [tourOpen, setTourOpen] = useState(false)
  const tourRef = useRef<HTMLDialogElement>(null)
  const liveOrders = useLiveOrders()

  const baseOrders = useMemo(() => generateOrders(today), [today])
  const orders = useMemo(
    () =>
      [...liveOrders, ...baseOrders].map((order) =>
        overrides[order.id] ? { ...order, status: overrides[order.id] } : order,
      ),
    [liveOrders, baseOrders, overrides],
  )

  const period = useMemo(() => periodFor(today, range), [today, range])
  const current = useMemo(() => ordersBetween(orders, period.from, period.to), [orders, period.from, period.to])
  const previous = useMemo(() => ordersBetween(orders, period.previousFrom, period.from), [orders, period.previousFrom, period.from])
  const currentSummary = summarize(current)
  const previousSummary = summarize(previous)
  const currentSeries = dailySeries(current, period.from, range)
  const previousSeries = dailySeries(previous, period.previousFrom, range)
  const openOrder = orders.find((order) => order.id === openOrderId) ?? null

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIntroHidden(window.localStorage.getItem(INTRO_KEY) === '1'))
    return () => cancelAnimationFrame(frame)
  }, [])

  // Highlight the menu item for the section currently on screen.
  useEffect(() => {
    if (!hydrated) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting)
        if (visible[0]) setActiveSection(visible[0].target.id)
      },
      { rootMargin: '-30% 0px -60% 0px' },
    )
    SECTIONS.forEach((section) => {
      const element = document.getElementById(section.id)
      if (element) observer.observe(element)
    })
    return () => observer.disconnect()
  }, [hydrated])

  useEffect(() => {
    const dialog = tourRef.current
    if (!dialog) return
    if (tourOpen && !dialog.open) {
      dialog.showModal()
      dialog.querySelector('video')?.play().catch(() => {})
    }
    if (!tourOpen && dialog.open) dialog.close()
    if (!tourOpen) dialog.querySelector('video')?.pause()
  }, [tourOpen])

  const dismissIntro = () => {
    window.localStorage.setItem(INTRO_KEY, '1')
    setIntroHidden(true)
  }

  const handleStatusChange = (order: Order, status: OrderStatus) =>
    setOverrides((currentOverrides) => ({ ...currentOverrides, [order.id]: status }))

  const rangeLabel = `${period.from.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} – ${today.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`

  const tourButton = (
    <button
      type="button"
      onClick={() => setTourOpen(true)}
      className="group inline-flex items-center gap-2 rounded-full bg-[#171412] py-2 pl-2 pr-4 text-sm font-medium text-white transition hover:bg-black"
    >
      <span className="grid h-7 w-7 place-items-center rounded-full bg-[#e9cf8f] text-[#171412] transition group-hover:scale-110">
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5 fill-current">
          <path d="M8 5.5v13l11-6.5-11-6.5Z" />
        </svg>
      </span>
      3D tour
    </button>
  )

  return (
    <div className="min-h-screen bg-[#f3eee6] text-[#171412] lg:grid lg:grid-cols-[248px_1fr]">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen flex-col bg-[#14110f] p-5 text-white lg:flex">
        <Link href="/ecommerce" aria-label="Luma store" className="px-2 pt-1">
          <Logo />
        </Link>
        <p className="mt-2 px-2 text-xs uppercase tracking-[0.3em] text-white/35">Admin</p>
        <nav aria-label="Dashboard sections" className="mt-8 grid gap-1 text-sm">
          {SECTIONS.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              aria-current={activeSection === section.id ? 'location' : undefined}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition ${
                activeSection === section.id ? 'bg-white/10 text-white' : 'text-white/55 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon path={section.icon} />
              {section.label}
            </a>
          ))}
        </nav>
        <div className="mt-8 grid gap-1 border-t border-white/10 pt-6 text-sm">
          <Link href="/ecommerce" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-white/55 transition hover:bg-white/5 hover:text-white">
            <Icon path="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6" />
            Open the store
          </Link>
          <Link href="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-white/55 transition hover:bg-white/5 hover:text-white">
            <Icon path="M15 5l-7 7 7 7" />
            Back to portfolio
          </Link>
        </div>
        <div className="mt-auto rounded-2xl bg-gradient-to-br from-[#3a2e24] to-[#1f1a16] p-4">
          <p className="text-sm font-medium">See it in motion</p>
          <p className="mt-1 text-xs leading-5 text-white/55">A 30-second 3D tour of this dashboard.</p>
          <button
            type="button"
            onClick={() => setTourOpen(true)}
            className="mt-3 w-full rounded-full bg-[#e9cf8f] py-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#171412] transition hover:bg-white"
          >
            Watch 3D tour
          </button>
        </div>
      </aside>

      <div className="min-w-0">
        {/* Phone and tablet top bar */}
        <header className="sticky top-0 z-30 border-b border-black/[0.07] bg-[#f3eee6]/90 backdrop-blur-xl lg:hidden">
          <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <Link href="/ecommerce" aria-label="Luma store">
              <Logo />
            </Link>
            <div className="flex items-center gap-2">
              <Link href="/" className="hidden rounded-full border border-black/10 px-3 py-2 text-xs sm:block">
                Portfolio
              </Link>
              {tourButton}
            </div>
          </div>
          <nav aria-label="Dashboard sections" className="flex gap-2 overflow-x-auto px-4 pb-3 sm:px-6">
            {SECTIONS.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                aria-current={activeSection === section.id ? 'location' : undefined}
                className={`shrink-0 rounded-full px-4 py-2 text-sm transition ${
                  activeSection === section.id ? 'bg-[#171412] text-white' : 'bg-white/70 text-black/65'
                }`}
              >
                {section.label}
              </a>
            ))}
          </nav>
        </header>

        <main className="mx-auto max-w-[1400px] space-y-5 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div id="overview" className="flex scroll-mt-32 flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#8c6a2f]">Luma store · Dashboard</p>
              <h1 className="mt-2 font-display text-4xl font-medium md:text-5xl">How the shop is doing</h1>
              <p className="mt-1 text-sm text-black/55">{hydrated ? rangeLabel : ' '}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Segmented
                label="Time range"
                value={String(range)}
                options={RANGES.map((value) => [String(value), `Last ${value} days`])}
                onChange={(value) => setRange(Number(value) as Range)}
              />
              <span className="hidden lg:block">{tourButton}</span>
            </div>
          </div>

          {!introHidden ? (
            <section aria-label="How this dashboard works" className="relative overflow-hidden rounded-[1.5rem] bg-[#14110f] p-5 text-white md:p-6">
              <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#e9cf8f]/15 blur-3xl" aria-hidden="true" />
              <button
                type="button"
                onClick={dismissIntro}
                aria-label="Hide this explanation"
                className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full text-white/50 transition hover:bg-white/10 hover:text-white"
              >
                ×
              </button>
              <p className="text-xs uppercase tracking-[0.3em] text-[#e9cf8f]">How it works</p>
              <ol className="relative mt-4 grid gap-4 md:grid-cols-3">
                {[
                  ['Place an order', 'Buy something in the Luma store. Use test card 4242 4242 4242 4242.'],
                  ['Watch it arrive', 'Your order shows up here instantly, marked LIVE, and updates every chart.'],
                  ['Manage it', 'Open any order to mark it shipped, delivered or refunded.'],
                ].map(([title, text], index) => (
                  <li key={title} className="flex gap-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/20 font-display text-lg">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium">{title}</p>
                      <p className="mt-0.5 text-sm leading-6 text-white/60">{text}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <Link
                href="/ecommerce"
                className="relative mt-5 inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-medium text-[#171412] transition hover:bg-[#f0e3c4]"
              >
                Open the store →
              </Link>
            </section>
          ) : null}

          {liveOrders.length ? (
            <div className="flex flex-col gap-3 rounded-2xl border border-[#2e7d4f]/25 bg-[#2e7d4f]/[0.07] px-5 py-4 text-sm sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-center gap-3">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2e7d4f] opacity-60" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#2e7d4f]" />
                </span>
                <span>
                  <strong className="font-semibold">{liveOrders.length} live order{liveOrders.length > 1 ? 's' : ''}</strong> from
                  the Luma store, worth {formatEuro(liveOrders.reduce((sum, order) => sum + order.total, 0))}.
                </span>
              </p>
              <button
                type="button"
                onClick={resetLiveOrders}
                className="self-start rounded-full border border-[#2e7d4f]/30 px-4 py-2 text-xs font-medium text-[#24653f] transition hover:bg-[#2e7d4f]/10 sm:self-auto"
              >
                Clear demo orders
              </button>
            </div>
          ) : null}

          {hydrated ? (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <KpiCard
                  label="Revenue"
                  hint="Money earned, minus refunds"
                  value={currentSummary.revenue}
                  format={(value) => formatEuro(value)}
                  delta={change(currentSummary.revenue, previousSummary.revenue)}
                  series={currentSeries.map((point) => point.revenue)}
                />
                <KpiCard
                  label="Orders"
                  hint="Number of purchases"
                  value={currentSummary.orders}
                  format={(value) => Math.round(value).toLocaleString('en-GB')}
                  delta={change(currentSummary.orders, previousSummary.orders)}
                  series={currentSeries.map((point) => point.orders)}
                />
                <KpiCard
                  label="Average order"
                  hint="Revenue ÷ paid orders"
                  value={currentSummary.averageOrder}
                  format={(value) => formatEuro(value)}
                  delta={change(currentSummary.averageOrder, previousSummary.averageOrder)}
                  series={currentSeries.map((point) => (point.orders ? point.revenue / point.orders : 0))}
                />
                <KpiCard
                  label="Customers"
                  hint="Different people who ordered"
                  value={currentSummary.customers}
                  format={(value) => Math.round(value).toLocaleString('en-GB')}
                  delta={change(currentSummary.customers, previousSummary.customers)}
                  series={currentSeries.map((point) => point.orders)}
                />
              </div>

              <div id="sales" className="grid scroll-mt-32 gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                <RevenueChart current={currentSeries} previous={previousSeries} />
                <CategoryBars data={revenueByCategory(current)} />
              </div>

              <div className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
                <TopProducts data={topProducts(current)} />
                <Heatmap grid={ordersHeatmap(current)} />
                <div className="lg:col-span-2 2xl:col-span-1">
                  <Channels data={channelShare(current)} />
                </div>
              </div>

              <OrdersTable orders={current} onOpen={(order) => setOpenOrderId(order.id)} />
            </>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-hidden="true">
              {[0, 1, 2, 3].map((index) => (
                <div key={index} className="h-36 animate-pulse rounded-[1.5rem] bg-black/[0.04]" />
              ))}
              <div className="h-96 animate-pulse rounded-[1.5rem] bg-black/[0.04] sm:col-span-2 xl:col-span-4" />
            </div>
          )}

          <footer className="pb-4 pt-6 text-center text-xs text-black/40">
            Demo data generated in the browser · Live orders come from the{' '}
            <Link href="/ecommerce" className="underline underline-offset-2">
              Luma store
            </Link>{' '}
            · Built by Diana Tsymbaliuk
          </footer>
        </main>
      </div>

      <OrderDrawer order={openOrder} onClose={() => setOpenOrderId(null)} onStatusChange={handleStatusChange} />

      <dialog
        ref={tourRef}
        onClose={() => setTourOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setTourOpen(false)
        }}
        aria-label="3D dashboard tour video"
        className="m-auto w-[min(72rem,calc(100%-2rem))] overflow-visible bg-transparent p-0 backdrop:bg-black/80 backdrop:backdrop-blur-md open:motion-safe:animate-[modal-in_0.45s_cubic-bezier(0.22,1,0.36,1)]"
      >
        <button
          type="button"
          onClick={() => setTourOpen(false)}
          aria-label="Close video"
          className="absolute -top-14 right-0 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-xl text-white transition hover:rotate-90 hover:bg-white hover:text-black"
        >
          ×
        </button>
        <video src={TOUR_VIDEO} poster={TOUR_POSTER} controls playsInline preload="none" className="aspect-video w-full rounded-[1.5rem] bg-black shadow-2xl" />
      </dialog>
    </div>
  )
}

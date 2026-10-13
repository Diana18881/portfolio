'use client'

import Link from 'next/link'
import { useMemo, useState, useSyncExternalStore } from 'react'
import Logo from '../../_components/logo'
import {
  BRUNCH_SLOTS,
  DINNER_SLOTS,
  TABLES,
  addDaysKey,
  assignTables,
  fromDateKey,
  guestCount,
  isClosed,
  isWeekend,
  resetDemo,
  toDateKey,
  updateStatus,
  useReservations,
  type ReservationStatus,
  type StoredReservation,
} from '../../_lib/reservations'
import FloorPlan from './floor-plan'

const subscribeNothing = () => () => {}
const useHydrated = () => useSyncExternalStore(subscribeNothing, () => true, () => false)

const STATUS_STYLE: Record<ReservationStatus, string> = {
  Confirmed: 'bg-[#c8a46a]/15 text-[#7a5f2e]',
  Arrived: 'bg-[#4f8a5b]/15 text-[#2f6b3c]',
  'No-show': 'bg-[#d08a2c]/15 text-[#8a5300]',
  Cancelled: 'bg-black/[0.06] text-black/45 line-through',
}

const ACTIONS: { status: ReservationStatus; label: string }[] = [
  { status: 'Arrived', label: 'Seat' },
  { status: 'No-show', label: 'No-show' },
  { status: 'Cancelled', label: 'Cancel' },
  { status: 'Confirmed', label: 'Undo' },
]

export default function Admin() {
  const hydrated = useHydrated()
  const reservations = useReservations()
  const [todayKey] = useState(() => toDateKey(new Date()))
  const [selected, setSelected] = useState(() => (isClosed(toDateKey(new Date())) ? addDaysKey(toDateKey(new Date()), 1) : toDateKey(new Date())))
  const [query, setQuery] = useState('')
  const [slot, setSlot] = useState<string | null>(null)

  const days = useMemo(() => Array.from({ length: 10 }, (_, index) => addDaysKey(todayKey, index)), [todayKey])
  const dayReservations = useMemo(
    () => reservations.filter((item) => item.date === selected).sort((a, b) => a.time.localeCompare(b.time)),
    [reservations, selected],
  )
  const assignment = useMemo(() => assignTables(dayReservations), [dayReservations])
  const active = dayReservations.filter((item) => item.status === 'Confirmed' || item.status === 'Arrived')
  const slots = [...(isWeekend(selected) ? BRUNCH_SLOTS : []), ...DINNER_SLOTS]
  const busiestSlot =
    slots
      .map((time) => ({ time, count: active.filter((item) => item.time === time).length }))
      .sort((a, b) => b.count - a.count)[0]?.time ?? slots[0]
  const currentSlot = slot && slots.includes(slot) ? slot : busiestSlot

  const filtered = dayReservations.filter((item) =>
    `${item.name} ${item.id} ${item.email} ${item.phone}`.toLowerCase().includes(query.trim().toLowerCase()),
  )
  const grouped = slots
    .map((time) => ({ time, items: filtered.filter((item) => item.time === time) }))
    .filter((group) => group.items.length)

  const stats = [
    { label: 'Bookings', value: active.length, hint: 'confirmed or seated' },
    { label: 'Covers', value: active.reduce((sum, item) => sum + guestCount(item.guests), 0), hint: 'guests expected' },
    { label: 'Seated', value: dayReservations.filter((item) => item.status === 'Arrived').length, hint: 'already arrived' },
    { label: 'Cancelled', value: dayReservations.filter((item) => item.status === 'Cancelled' || item.status === 'No-show').length, hint: 'incl. no-shows' },
  ]

  const card = (item: StoredReservation) => (
    <li key={item.id} className={`rounded-2xl border border-black/[0.06] bg-white p-4 transition ${item.status === 'Cancelled' ? 'opacity-60' : ''}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-2 font-medium">
            {item.name}
            {!item.demo ? <span className="rounded-full bg-[#4f8a5b] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">New</span> : null}
          </p>
          <p className="mt-0.5 text-xs text-black/45">
            {item.id} · {item.phone}
          </p>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLE[item.status]}`}>{item.status}</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2 text-xs text-black/60">
        <span className="rounded-full bg-black/[0.04] px-2.5 py-1">👥 {guestCount(item.guests)}</span>
        <span className="rounded-full bg-black/[0.04] px-2.5 py-1">{assignment.get(item.id) ?? '—'} · {item.seating}</span>
        {item.occasion && !['Dinner', 'None'].includes(item.occasion) ? <span className="rounded-full bg-black/[0.04] px-2.5 py-1">{item.occasion}</span> : null}
        {item.notes ? <span className="rounded-full bg-[#d08a2c]/15 px-2.5 py-1 text-[#8a5300]">⚠ {item.notes}</span> : null}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {ACTIONS.filter((action) => action.status !== item.status && (action.status !== 'Confirmed' || item.status !== 'Confirmed')).map((action) => (
          <button
            key={action.status}
            type="button"
            onClick={() => updateStatus(item.id, action.status)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
              action.status === 'Arrived' ? 'bg-[#14281f] text-white hover:bg-black' : 'border border-black/10 text-black/60 hover:border-black/40 hover:text-black'
            }`}
          >
            {action.label}
          </button>
        ))}
      </div>
    </li>
  )

  return (
    <div className="min-h-screen bg-[#efe8dc] text-[#14281f]">
      <header className="bg-[#0f1f1a] text-[#f3ede2]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <Link href="/brand" aria-label="Maison Verde guest website">
            <Logo />
          </Link>
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
            <Link href="/brand#reserve" className="rounded-full bg-[#c8a46a] px-4 py-2 font-medium text-[#0f1f1a]">
              + New booking
            </Link>
            <Link href="/brand" className="rounded-full border border-white/20 px-4 py-2 text-white/80 hover:text-white">
              Guest website
            </Link>
            <Link href="/" className="hidden rounded-full border border-white/20 px-4 py-2 text-white/80 hover:text-white sm:inline-flex">
              Portfolio
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#8a6d3b]">Reservation admin</p>
            <h1 className="mt-2 font-display text-5xl font-medium">Tonight at a glance</h1>
          </div>
          <button type="button" onClick={resetDemo} className="rounded-full border border-black/15 px-4 py-2 text-xs text-black/60 transition hover:border-black/40 hover:text-black">
            Reset demo data
          </button>
        </div>

        {hydrated ? (
          <>
            <div role="group" aria-label="Service date" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
              {days.map((key) => {
                const day = fromDateKey(key)
                const closed = isClosed(key)
                const count = reservations.filter((item) => item.date === key && item.status !== 'Cancelled').length
                return (
                  <button
                    key={key}
                    type="button"
                    disabled={closed}
                    aria-pressed={key === selected}
                    onClick={() => {
                      setSelected(key)
                      setSlot(null)
                    }}
                    className={`flex w-[4.5rem] shrink-0 flex-col items-center rounded-2xl border px-2 py-3 transition disabled:cursor-not-allowed disabled:opacity-40 ${
                      key === selected ? 'border-[#14281f] bg-[#14281f] text-[#f3ede2]' : 'border-black/[0.06] bg-white hover:border-black/30'
                    }`}
                  >
                    <span className="text-[0.65rem] uppercase tracking-wider opacity-70">{key === todayKey ? 'Today' : day.toLocaleDateString('en-GB', { weekday: 'short' })}</span>
                    <span className="mt-1 font-display text-2xl leading-none">{day.getDate()}</span>
                    <span className="mt-1.5 text-[0.65rem] opacity-70">{closed ? 'Closed' : `${count} bkgs`}</span>
                  </button>
                )
              })}
            </div>

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {stats.map((item) => (
                <div key={item.label} className="rounded-2xl bg-white p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-black/45">{item.label}</p>
                  <p className="mt-2 font-display text-5xl leading-none">{item.value}</p>
                  <p className="mt-2 text-xs text-black/45">{item.hint}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
              <div className="space-y-4">
                <FloorPlan reservations={dayReservations} assignment={assignment} time={currentSlot} />
                <div className="rounded-2xl bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-black/45">Time slot · tables booked of {TABLES.length}</p>
                  <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
                    {slots.map((time) => {
                      const count = active.filter((item) => item.time === time).length
                      return (
                        <button
                          key={time}
                          type="button"
                          aria-pressed={time === currentSlot}
                          onClick={() => setSlot(time)}
                          className={`rounded-xl border px-2 py-2 text-center transition ${time === currentSlot ? 'border-[#14281f] bg-[#14281f] text-white' : 'border-black/[0.06] hover:border-black/30'}`}
                        >
                          <span className="block text-sm font-medium">{time}</span>
                          <span className="mt-1 block h-1 overflow-hidden rounded-full bg-black/10">
                            <span className="block h-full bg-[#c8a46a]" style={{ width: `${(count / TABLES.length) * 100}%` }} />
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              <section aria-label="Reservations" className="rounded-[1.5rem] bg-[#f6f1e8] p-4 md:p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="font-display text-3xl">Guest list</h2>
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search name, ID, phone…"
                    aria-label="Search reservations"
                    className="w-full rounded-full border border-black/10 bg-white px-4 py-2 text-sm outline-none focus:border-black/40 sm:w-56"
                  />
                </div>
                {grouped.length ? (
                  <div className="mt-4 max-h-[44rem] space-y-5 overflow-y-auto pr-1">
                    {grouped.map((group) => (
                      <div key={group.time}>
                        <button type="button" onClick={() => setSlot(group.time)} className="mb-2 flex items-center gap-3 text-sm font-medium">
                          <span className="font-display text-2xl">{group.time}</span>
                          <span className="text-xs text-black/45">{group.items.length} booking{group.items.length > 1 ? 's' : ''}</span>
                        </button>
                        <ul className="space-y-2">{group.items.map(card)}</ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-6 rounded-2xl bg-white p-8 text-center text-black/55">No bookings for this day yet.</p>
                )}
              </section>
            </div>
          </>
        ) : (
          <div className="h-[40rem] animate-pulse rounded-[1.5rem] bg-black/[0.04]" aria-hidden="true" />
        )}
      </main>
    </div>
  )
}

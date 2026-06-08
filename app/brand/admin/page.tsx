'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

type ReservationStatus = 'Confirmed' | 'Arrived' | 'Cancelled' | 'No-show'

type StoredReservation = {
  id: string
  name: string
  email: string
  phone: string
  date: string
  time: string
  guests: string
  occasion: string
  seating: string
  notes: string
  createdAt: string
  status: ReservationStatus
}

const RESERVATIONS_STORAGE_KEY = 'maison-verde-reservations'

const statuses: ReservationStatus[] = ['Confirmed', 'Arrived', 'Cancelled', 'No-show']

const tables = [
  { id: 'T1', area: 'Window table', seats: 2 },
  { id: 'T2', area: 'Dining room', seats: 4 },
  { id: 'T3', area: 'Dining room', seats: 4 },
  { id: 'T4', area: 'Terrace', seats: 2 },
  { id: 'T5', area: 'Terrace', seats: 6 },
  { id: 'BAR', area: 'Bar counter', seats: 8 },
]

const getDateInputValue = (daysFromToday = 0) => {
  const date = new Date()

  date.setDate(date.getDate() + daysFromToday)

  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000)

  return localDate.toISOString().split('T')[0]
}

const normalizeReservations = (items: StoredReservation[], today: string) =>
  items
    .map((item) => ({
      ...item,
      phone: item.phone || 'Not provided',
      seating: item.seating || 'Dining room',
      notes: item.notes || '',
      status: item.status || 'Confirmed',
    }))
    .filter((item) => item.date >= today)

export default function BrandAdminPage() {
  const today = getDateInputValue()
  const [selectedDate, setSelectedDate] = useState(today)
  const [reservations, setReservations] = useState<StoredReservation[]>([])

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      const savedReservations = window.localStorage.getItem(RESERVATIONS_STORAGE_KEY)

      if (!savedReservations) return

      const activeReservations = normalizeReservations(
        JSON.parse(savedReservations) as StoredReservation[],
        today,
      )

      window.localStorage.setItem(RESERVATIONS_STORAGE_KEY, JSON.stringify(activeReservations))
      setReservations(activeReservations)
    })

    return () => window.cancelAnimationFrame(frameId)
  }, [today])

  const dateReservations = useMemo(
    () => reservations.filter((item) => item.date === selectedDate),
    [reservations, selectedDate],
  )

  const activeReservations = dateReservations.filter(
    (item) => item.status === 'Confirmed' || item.status === 'Arrived',
  )

  const updateStatus = (reservationId: string, status: ReservationStatus) => {
    const nextReservations = reservations.map((item) =>
      item.id === reservationId ? { ...item, status } : item,
    )

    window.localStorage.setItem(RESERVATIONS_STORAGE_KEY, JSON.stringify(nextReservations))
    setReservations(nextReservations)
  }

  const clearReservations = () => {
    window.localStorage.removeItem(RESERVATIONS_STORAGE_KEY)
    setReservations([])
  }

  return (
    <main className="min-h-screen bg-[#f6f1e8] text-[#171714]">
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:px-8 lg:px-12">
        <header className="flex flex-col gap-4 border-b border-black/10 pb-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#85703a]">
              Maison Verde
            </p>
            <h1 className="mt-3 text-4xl font-semibold md:text-6xl">
              Reservation admin
            </h1>
          </div>
          <nav className="flex flex-wrap gap-3 text-sm">
            <Link href="/brand" className="rounded-full bg-[#10231d] px-5 py-3 font-semibold text-white">
              Guest website
            </Link>
            <Link href="/" className="rounded-full border border-black/10 px-5 py-3 font-semibold text-black/65">
              Portfolio
            </Link>
          </nav>
        </header>

        <div className="mt-6 flex flex-wrap gap-2">
          {statuses.map((status) => (
            <span
              key={status}
              className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-black/60"
            >
              {status}
            </span>
          ))}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.5rem] bg-white p-5 shadow-sm">
              <p className="text-3xl font-semibold">{dateReservations.length}</p>
              <p className="mt-1 text-sm text-black/55">bookings for date</p>
            </div>
            <div className="rounded-[1.5rem] bg-white p-5 shadow-sm">
              <p className="text-3xl font-semibold">{activeReservations.length}</p>
              <p className="mt-1 text-sm text-black/55">active tables</p>
            </div>
            <div className="rounded-[1.5rem] bg-white p-5 shadow-sm">
              <p className="text-3xl font-semibold">
                {dateReservations.filter((item) => item.status === 'Cancelled').length}
              </p>
              <p className="mt-1 text-sm text-black/55">cancelled</p>
            </div>
          </div>
          <div className="grid gap-3">
            <label className="text-sm font-semibold">
              Service date
              <input
                type="date"
                min={today}
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
                className="mt-2 w-full rounded-full border border-black/10 bg-white px-5 py-4 outline-none"
              />
            </label>
            <button
              type="button"
              onClick={clearReservations}
              className="rounded-full border border-black/10 px-5 py-3 text-sm font-semibold text-black/60"
            >
              Clear demo database
            </button>
          </div>
        </div>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-[2rem] bg-[#10231d] p-5 text-white md:p-7">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#d6b86a]">
              Table map
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {tables.map((table) => {
                const reservation = activeReservations.find(
                  (item) => item.seating === table.area,
                )

                return (
                  <div
                    key={table.id}
                    className={`rounded-[1.25rem] border p-4 ${
                      reservation
                        ? 'border-[#d6b86a] bg-[#d6b86a] text-black'
                        : 'border-white/10 bg-white/5 text-white'
                    }`}
                  >
                    <p className="text-2xl font-semibold">{table.id}</p>
                    <p className="mt-1 text-sm opacity-70">{table.area}</p>
                    <p className="mt-3 text-sm">{reservation ? reservation.name : `${table.seats} seats free`}</p>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-5 shadow-sm md:p-7">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#85703a]">
              Reservation list
            </p>
            {dateReservations.length ? (
              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[980px] border-separate border-spacing-y-3 text-left text-sm">
                  <thead className="text-black/45">
                    <tr>
                      <th className="px-4 font-medium">Guest</th>
                      <th className="px-4 font-medium">Time</th>
                      <th className="px-4 font-medium">Guests</th>
                      <th className="px-4 font-medium">Seating</th>
                      <th className="px-4 font-medium">Contact</th>
                      <th className="px-4 font-medium">Notes</th>
                      <th className="px-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dateReservations.map((item) => (
                      <tr key={item.id} className="bg-[#f6f1e8]">
                        <td className="rounded-l-[1rem] px-4 py-4">
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-xs text-black/45">{item.id}</p>
                        </td>
                        <td className="px-4 py-4">{item.time}</td>
                        <td className="px-4 py-4">{item.guests}</td>
                        <td className="px-4 py-4">{item.seating}</td>
                        <td className="px-4 py-4 text-black/55">
                          <p>{item.email}</p>
                          <p>{item.phone}</p>
                        </td>
                        <td className="max-w-[220px] px-4 py-4 text-black/55">
                          {item.notes || 'No notes'}
                        </td>
                        <td className="rounded-r-[1rem] px-4 py-4">
                          <div className="flex flex-wrap gap-2">
                            {statuses.map((status) => (
                              <button
                                key={status}
                                type="button"
                                onClick={() => updateStatus(item.id, status)}
                                className={`rounded-full px-3 py-2 text-xs font-semibold ${
                                  item.status === status
                                    ? 'bg-[#10231d] text-white'
                                    : 'bg-white text-black/50'
                                }`}
                              >
                                {status}
                              </button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="mt-5 rounded-[1.5rem] bg-[#f6f1e8] p-5 text-black/55">
                No bookings for this date yet.
              </p>
            )}
          </div>
        </section>
      </section>
    </main>
  )
}

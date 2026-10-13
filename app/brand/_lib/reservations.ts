'use client'

import { useSyncExternalStore } from 'react'

export const RESERVATIONS_STORAGE_KEY = 'maison-verde-reservations'

export type ReservationStatus = 'Confirmed' | 'Arrived' | 'Cancelled' | 'No-show'
export type Service = 'Dinner' | 'Brunch'

export type StoredReservation = {
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
  demo?: boolean
}

export const SEATING_AREAS = ['Dining room', 'Window table', 'Bar counter', 'Terrace'] as const
export const OCCASIONS = ['None', 'Birthday', 'Date night', 'Business dinner'] as const
export const DINNER_SLOTS = ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30']
export const BRUNCH_SLOTS = ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00']
// Tables that can start at the same time; a slot is full once they are all taken.
export const TABLES_PER_SLOT = 4

export const TABLES = [
  { id: 'T1', area: 'Window table', seats: 2, x: 12, y: 18 },
  { id: 'T2', area: 'Window table', seats: 2, x: 12, y: 50 },
  { id: 'T3', area: 'Dining room', seats: 4, x: 40, y: 22 },
  { id: 'T4', area: 'Dining room', seats: 4, x: 40, y: 58 },
  { id: 'T5', area: 'Dining room', seats: 6, x: 64, y: 40 },
  { id: 'T6', area: 'Terrace', seats: 4, x: 88, y: 22 },
  { id: 'T7', area: 'Terrace', seats: 2, x: 88, y: 60 },
  { id: 'BAR', area: 'Bar counter', seats: 6, x: 40, y: 90 },
] as const

export const toDateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

export const fromDateKey = (key: string) => new Date(`${key}T12:00:00`)

export const addDaysKey = (key: string, days: number) => {
  const date = fromDateKey(key)
  date.setDate(date.getDate() + days)
  return toDateKey(date)
}

export const isClosed = (key: string) => fromDateKey(key).getDay() === 1

export const isWeekend = (key: string) => [0, 6].includes(fromDateKey(key).getDay())

export const slotsFor = (key: string, service: Service) =>
  service === 'Brunch' ? (isWeekend(key) ? BRUNCH_SLOTS : []) : DINNER_SLOTS

export const guestCount = (guests: string) => Number.parseInt(guests, 10) || 2

const isActive = (reservation: StoredReservation) =>
  reservation.status === 'Confirmed' || reservation.status === 'Arrived'

export const tablesLeft = (reservations: StoredReservation[], key: string, time: string) =>
  TABLES_PER_SLOT - reservations.filter((item) => item.date === key && item.time === time && isActive(item)).length

// Assign each active booking of a day to a table, preferring the requested area and a fitting size.
export const assignTables = (reservations: StoredReservation[]) => {
  const assignment = new Map<string, string>()
  const byTime = new Map<string, StoredReservation[]>()
  reservations.filter(isActive).forEach((item) => byTime.set(item.time, [...(byTime.get(item.time) ?? []), item]))

  byTime.forEach((items) => {
    const used = new Set<string>()
    ;[...items]
      .sort((a, b) => guestCount(b.guests) - guestCount(a.guests))
      .forEach((item) => {
        const size = guestCount(item.guests)
        const candidates = TABLES.filter((table) => !used.has(table.id) && table.seats >= size)
        const table =
          candidates.find((candidate) => candidate.area === item.seating) ??
          candidates.sort((a, b) => a.seats - b.seats)[0]
        if (table) {
          used.add(table.id)
          assignment.set(item.id, table.id)
        }
      })
  })

  return assignment
}

// ── Demo bookings so the admin and slot availability look like a real restaurant ──
const demoGuests = ['Mia Schneider', 'Jonas Weber', 'Lea Hoffmann', 'Noah Richter', 'Emma Fischer', 'Paul Wagner', 'Hanna Becker', 'Felix Schulz', 'Clara Koch', 'Leon Bauer', 'Sofia Klein', 'Elias Wolf']

const seedReservations = (todayKey: string): StoredReservation[] => {
  const seeded: StoredReservation[] = []
  let counter = 0

  for (let offset = 0; offset < 10; offset += 1) {
    const key = addDaysKey(todayKey, offset)
    if (isClosed(key)) continue
    const services: Service[] = isWeekend(key) ? ['Brunch', 'Dinner'] : ['Dinner']

    services.forEach((service) => {
      slotsFor(key, service).forEach((time, slotIndex) => {
        const busy = (offset * 7 + slotIndex * 3) % 5
        const count = Math.max(0, Math.min(TABLES_PER_SLOT, busy - (offset > 5 ? 2 : 0)))
        for (let index = 0; index < count; index += 1) {
          counter += 1
          const name = demoGuests[(counter * 5) % demoGuests.length]
          seeded.push({
            id: `MV-${1000 + counter}`,
            name,
            email: `${name.split(' ')[0].toLowerCase()}@example.com`,
            phone: `+49 151 ${String(2000000 + counter * 7919).slice(0, 7)}`,
            date: key,
            time,
            guests: `${[2, 2, 4, 3, 2, 6, 4][counter % 7]} guests`,
            occasion: OCCASIONS[counter % 4],
            seating: SEATING_AREAS[counter % 4],
            notes: counter % 6 === 0 ? 'Nut allergy' : counter % 9 === 0 ? 'Anniversary, quiet table please' : '',
            createdAt: new Date().toISOString(),
            status: offset === 0 && slotIndex < 2 ? 'Arrived' : 'Confirmed',
            demo: true,
          })
        }
      })
    })
  }

  return seeded
}

// ── Store: localStorage-backed, shared by the guest site and the admin ──
let cache: { raw: string | null; items: StoredReservation[] } = { raw: null, items: [] }
const listeners = new Set<() => void>()
const empty: StoredReservation[] = []

const read = () => {
  const todayKey = toDateKey(new Date())
  let raw = window.localStorage.getItem(RESERVATIONS_STORAGE_KEY)

  if (raw === null) {
    raw = JSON.stringify(seedReservations(todayKey))
    window.localStorage.setItem(RESERVATIONS_STORAGE_KEY, raw)
  }

  if (raw !== cache.raw) {
    const parsed = (JSON.parse(raw) as StoredReservation[])
      .map((item) => ({
        ...item,
        phone: item.phone || 'Not provided',
        seating: item.seating || 'Dining room',
        notes: item.notes || '',
        status: item.status || 'Confirmed',
      }))
      .filter((item) => item.date >= todayKey)
    cache = { raw, items: parsed }
  }

  return cache.items
}

const write = (items: StoredReservation[]) => {
  window.localStorage.setItem(RESERVATIONS_STORAGE_KEY, JSON.stringify(items))
  listeners.forEach((listener) => listener())
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  const onStorage = (event: StorageEvent) => {
    if (event.key === RESERVATIONS_STORAGE_KEY || event.key === null) listener()
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

export const useReservations = () => useSyncExternalStore(subscribe, read, () => empty)

export const addReservation = (reservation: StoredReservation) => write([reservation, ...read()])

export const updateStatus = (id: string, status: ReservationStatus) =>
  write(read().map((item) => (item.id === id ? { ...item, status } : item)))

export const cancelReservation = (id: string, email: string) => {
  const items = read()
  const match = items.find(
    (item) =>
      item.id.toLowerCase() === id.trim().toLowerCase() &&
      item.email.toLowerCase() === email.trim().toLowerCase() &&
      item.status !== 'Cancelled',
  )
  if (!match) return false
  write(items.map((item) => (item === match ? { ...item, status: 'Cancelled' as const } : item)))
  return true
}

export const resetDemo = () => {
  window.localStorage.removeItem(RESERVATIONS_STORAGE_KEY)
  listeners.forEach((listener) => listener())
}

export const newReservationId = () => `MV-${Math.floor(2000 + Math.random() * 8000)}`

// A tiny .ics file so guests can add the booking to their calendar.
export const calendarFile = (reservation: StoredReservation) => {
  const [hours, minutes] = reservation.time.split(':').map(Number)
  const start = fromDateKey(reservation.date)
  start.setHours(hours, minutes, 0, 0)
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000)
  const stamp = (date: Date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Maison Verde//Reservations//EN',
    'BEGIN:VEVENT',
    `UID:${reservation.id}@maisonverde.example`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:Maison Verde · ${reservation.guests}`,
    'LOCATION:Oranienstraße 44\\, 10999 Berlin',
    `DESCRIPTION:Booking ${reservation.id}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

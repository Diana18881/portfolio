'use client'

import { useState } from 'react'
import { TABLES, guestCount, type StoredReservation } from '../../_lib/reservations'

type Props = {
  reservations: StoredReservation[]
  assignment: Map<string, string>
  time: string
}

const STATUS_FILL: Record<string, { top: string; side: string; label: string }> = {
  free: { top: '#f3ede2', side: '#d8cfbf', label: 'Free' },
  Confirmed: { top: '#c8a46a', side: '#9c7d4a', label: 'Booked' },
  Arrived: { top: '#4f8a5b', side: '#386643', label: 'Seated' },
}

// Isometric room: a tilted floor with tables extruded as small 3D blocks.
export default function FloorPlan({ reservations, assignment, time }: Props) {
  const [view, setView] = useState<'3d' | '2d'>('3d')
  const [hovered, setHovered] = useState<string | null>(null)

  const atTime = reservations.filter((item) => item.time === time && assignment.has(item.id))
  const byTable = new Map(atTime.map((item) => [assignment.get(item.id)!, item]))
  const hoveredBooking = hovered ? byTable.get(hovered) : undefined

  return (
    <div className="rounded-[1.5rem] bg-[#0f1f1a] p-5 text-[#f3ede2] md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#c8a46a]">Floor plan</p>
          <p className="mt-1 font-display text-3xl">Tables at {time || '—'}</p>
        </div>
        <div role="group" aria-label="View" className="flex rounded-full bg-white/10 p-1 text-xs">
          {(['3d', '2d'] as const).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={view === option}
              onClick={() => setView(option)}
              className={`rounded-full px-3 py-1.5 uppercase transition ${view === option ? 'bg-[#f3ede2] text-[#0f1f1a]' : 'text-white/60'}`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="relative mt-4 h-[300px] [perspective:1200px] sm:h-[340px]">
        <div
          className="absolute inset-x-[6%] top-[8%] h-[80%] rounded-[1.25rem] border border-white/10 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:28px_28px] transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] [transform-style:preserve-3d]"
          style={{ transform: view === '3d' ? 'rotateX(52deg) rotateZ(-32deg) scale(0.92)' : 'none', backgroundColor: '#163025' }}
        >
          <span className="absolute left-[74%] top-0 h-full w-px bg-white/15" aria-hidden="true" />
          <span className="absolute left-[78%] top-2 text-[10px] uppercase tracking-[0.3em] text-white/35">Terrace</span>
          <span className="absolute left-2 top-2 text-[10px] uppercase tracking-[0.3em] text-white/35">Window</span>
          <span className="absolute bottom-2 left-[34%] text-[10px] uppercase tracking-[0.3em] text-white/35">Bar</span>

          {TABLES.map((table) => {
            const booking = byTable.get(table.id)
            const fill = STATUS_FILL[booking ? booking.status : 'free'] ?? STATUS_FILL.free
            const width = table.id === 'BAR' ? 30 : table.seats >= 6 ? 13 : table.seats >= 4 ? 10 : 7
            const depth = table.id === 'BAR' ? 4 : 8
            const height = view === '3d' ? (booking ? 26 : 12) : 0

            return (
              <button
                key={table.id}
                type="button"
                onPointerEnter={() => setHovered(table.id)}
                onPointerLeave={() => setHovered(null)}
                onFocus={() => setHovered(table.id)}
                onBlur={() => setHovered(null)}
                aria-label={`${table.id}, ${table.seats} seats, ${booking ? `${fill.label}: ${booking.name}, ${booking.guests}` : 'free'}`}
                className="absolute -translate-x-1/2 -translate-y-1/2 [transform-style:preserve-3d]"
                style={{ left: `${table.x}%`, top: `${table.y}%`, width: `${width}%`, height: `${depth * 2.4}%` }}
              >
                <span
                  className="absolute inset-0 rounded-md transition-all duration-700"
                  style={{
                    background: fill.top,
                    transform: `translateZ(${height}px)`,
                    boxShadow: hovered === table.id ? '0 0 0 2px #fff' : undefined,
                  }}
                >
                  <span className={`grid h-full place-items-center text-[10px] font-semibold ${booking ? 'text-white' : 'text-[#0f1f1a]'}`}>
                    {table.id}
                  </span>
                </span>
                {/* Side faces give the block its height in 3D */}
                <span
                  className="absolute inset-x-0 bottom-0 origin-bottom transition-all duration-700"
                  style={{ height: `${height}px`, background: fill.side, transform: 'rotateX(-90deg)' }}
                />
                <span
                  className="absolute inset-y-0 right-0 origin-right transition-all duration-700"
                  style={{ width: `${height}px`, background: fill.side, filter: 'brightness(0.85)', transform: 'rotateY(90deg)' }}
                />
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-white/60">
        <div className="flex flex-wrap gap-4">
          {['free', 'Confirmed', 'Arrived'].map((key) => (
            <span key={key} className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm" style={{ background: STATUS_FILL[key].top }} />
              {STATUS_FILL[key].label}
            </span>
          ))}
        </div>
        <p aria-live="polite" className="min-h-4 text-white/80">
          {hovered
            ? hoveredBooking
              ? `${hovered} · ${hoveredBooking.name} · ${guestCount(hoveredBooking.guests)} guests`
              : `${hovered} · free`
            : `${atTime.length} of ${TABLES.length} tables booked`}
        </p>
      </div>
    </div>
  )
}

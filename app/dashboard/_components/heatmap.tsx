'use client'

import { useState } from 'react'
import { TIME_SLOTS, WEEKDAYS } from '../_lib/data'
import Panel from './panel'

// One hue, light to dark: more orders = deeper gold.
const LOW = [246, 236, 214]
const HIGH = [122, 78, 6]
const shade = (ratio: number) =>
  `rgb(${LOW.map((channel, index) => Math.round(channel + (HIGH[index] - channel) * ratio)).join(',')})`

export default function Heatmap({ grid }: { grid: number[][] }) {
  const [active, setActive] = useState<{ day: number; slot: number } | null>(null)
  const max = Math.max(...grid.flat(), 1)
  const busiest = grid
    .flatMap((row, day) => row.map((count, slot) => ({ day, slot, count })))
    .sort((a, b) => b.count - a.count)[0]

  return (
    <Panel
      title="When people shop"
      description={`Orders by weekday and time of day. Busiest: ${WEEKDAYS[busiest.day]} ${TIME_SLOTS[busiest.slot]} h.`}
    >
      <div className="grid grid-cols-[2.5rem_repeat(6,1fr)] gap-1 text-[11px]">
        <span />
        {TIME_SLOTS.map((slot) => (
          <span key={slot} className="pb-1 text-center text-black/45">
            {slot}
          </span>
        ))}
        {grid.map((row, day) => (
          <div key={WEEKDAYS[day]} className="contents">
            <span className="flex items-center text-black/50">{WEEKDAYS[day]}</span>
            {row.map((count, slot) => {
              const isActive = active?.day === day && active.slot === slot
              return (
                <button
                  key={slot}
                  type="button"
                  aria-label={`${WEEKDAYS[day]} ${TIME_SLOTS[slot]} h: ${count} orders`}
                  onPointerEnter={() => setActive({ day, slot })}
                  onPointerLeave={() => setActive(null)}
                  onFocus={() => setActive({ day, slot })}
                  onBlur={() => setActive(null)}
                  className={`aspect-[1.6] rounded-md transition ${isActive ? 'ring-2 ring-[#171412] ring-offset-1 ring-offset-[#fffdf9]' : ''}`}
                  style={{ backgroundColor: shade(count / max) }}
                />
              )
            })}
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between gap-4 text-xs text-black/50">
        <p aria-live="polite" className="min-h-4">
          {active ? (
            <>
              <strong className="font-semibold text-[#171412]">{grid[active.day][active.slot]} orders</strong> on{' '}
              {WEEKDAYS[active.day]}, {TIME_SLOTS[active.slot]} h
            </>
          ) : (
            'Hover a cell for the exact number'
          )}
        </p>
        <span className="flex items-center gap-2">
          Fewer
          <span className="h-2 w-20 rounded-full" style={{ background: `linear-gradient(to right, ${shade(0)}, ${shade(1)})` }} />
          More
        </span>
      </div>
    </Panel>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'
import { smoothPath } from './chart-utils'

// Counts up from the previous value when the number changes (e.g. switching range).
const useCountUp = (target: number) => {
  const [value, setValue] = useState(target)
  const fromRef = useRef(target)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      fromRef.current = target
      const frame = requestAnimationFrame(() => setValue(target))
      return () => cancelAnimationFrame(frame)
    }
    const from = fromRef.current
    const start = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const progress = Math.min((now - start) / 700, 1)
      const eased = 1 - (1 - progress) ** 3
      setValue(from + (target - from) * eased)
      if (progress < 1) frame = requestAnimationFrame(tick)
      else fromRef.current = target
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target])

  return value
}

export default function KpiCard({
  label,
  hint,
  value,
  format,
  delta,
  series,
}: {
  label: string
  hint: string
  value: number
  format: (value: number) => string
  delta: number
  series: number[]
}) {
  const animated = useCountUp(value)
  const up = delta >= 0
  const max = Math.max(...series, 1)
  const points = series.map((point, index): [number, number] => [
    series.length > 1 ? (index / (series.length - 1)) * 120 : 60,
    36 - (point / max) * 32,
  ])
  const path = smoothPath(points)

  return (
    <article className="rounded-[1.5rem] border border-black/[0.06] bg-[#fffdf9] p-5 shadow-[0_1px_2px_rgba(23,20,18,0.04),0_12px_32px_-16px_rgba(23,20,18,0.12)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-black/50">{label}</p>
          <p className="mt-0.5 text-xs text-black/40">{hint}</p>
        </div>
        <span
          className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
            up ? 'bg-[#2e7d4f]/10 text-[#2e7d4f]' : 'bg-[#b3261e]/10 text-[#b3261e]'
          }`}
        >
          <svg viewBox="0 0 12 12" aria-hidden="true" className={`h-3 w-3 ${up ? '' : 'rotate-180'}`}>
            <path d="M6 2.5 10 7H2l4-4.5Z" fill="currentColor" />
          </svg>
          {Math.abs(delta * 100).toFixed(1)}%
          <span className="sr-only">{up ? 'up' : 'down'} vs previous period</span>
        </span>
      </div>
      <div className="mt-4 flex items-end justify-between gap-4">
        <p className="font-display text-[2.1rem] font-semibold leading-none tabular-nums 2xl:text-[2.4rem]">{format(animated)}</p>
        <svg viewBox="0 0 120 40" aria-hidden="true" className="h-9 w-16 shrink-0 overflow-visible 2xl:w-24">
          <path d={path} fill="none" stroke="#b07a12" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>
      <p className="mt-2 text-xs text-black/45">vs previous period</p>
    </article>
  )
}

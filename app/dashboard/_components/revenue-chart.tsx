'use client'

import { useState } from 'react'
import { formatCompactEuro, formatDay, formatEuro } from '../_lib/data'
import { niceTicks, smoothPath, useElementWidth } from './chart-utils'
import Panel from './panel'

type Point = { date: Date; revenue: number; orders: number }
type Metric = 'revenue' | 'orders'

const HEIGHT = 280
const PAD = { top: 16, right: 12, bottom: 32, left: 52 }

export default function RevenueChart({ current, previous }: { current: Point[]; previous: Point[] }) {
  const [metric, setMetric] = useState<Metric>('revenue')
  const [view, setView] = useState<'chart' | 'table'>('chart')
  const [active, setActive] = useState<number | null>(null)
  const [ref, width] = useElementWidth<HTMLDivElement>()

  const format = (value: number) => (metric === 'revenue' ? formatEuro(value) : `${value} orders`)
  const values = current.map((point) => point[metric])
  const previousValues = previous.map((point) => point[metric])
  const ticks = niceTicks(Math.max(...values, ...previousValues, 1))
  const top = ticks[ticks.length - 1]

  const innerWidth = Math.max(width - PAD.left - PAD.right, 1)
  const innerHeight = HEIGHT - PAD.top - PAD.bottom
  const x = (index: number) => PAD.left + (current.length > 1 ? (index / (current.length - 1)) * innerWidth : innerWidth / 2)
  const y = (value: number) => PAD.top + innerHeight - (value / top) * innerHeight

  const line = smoothPath(values.map((value, index) => [x(index), y(value)]))
  const previousLine = smoothPath(previousValues.map((value, index) => [x(index), y(value)]))
  const area = line ? `${line}L${x(values.length - 1)},${y(0)}L${x(0)},${y(0)}Z` : ''
  const labelEvery = Math.ceil(current.length / Math.max(Math.floor(innerWidth / 70), 2))

  const total = values.reduce((sum, value) => sum + value, 0)
  const previousTotal = previousValues.reduce((sum, value) => sum + value, 0)

  const setFromPointer = (clientX: number, rect: DOMRect) => {
    const ratio = (clientX - rect.left - PAD.left) / innerWidth
    setActive(Math.min(Math.max(Math.round(ratio * (current.length - 1)), 0), current.length - 1))
  }

  return (
    <Panel
      title={metric === 'revenue' ? 'Revenue over time' : 'Orders over time'}
      description="Each point is one day. The grey line is the same number of days just before, for comparison."
      actions={
        <div className="flex flex-wrap gap-2">
          <Segmented
            label="Metric"
            value={metric}
            options={[
              ['revenue', 'Revenue'],
              ['orders', 'Orders'],
            ]}
            onChange={(value) => setMetric(value as Metric)}
          />
          <Segmented
            label="View"
            value={view}
            options={[
              ['chart', 'Chart'],
              ['table', 'Table'],
            ]}
            onChange={(value) => setView(value as 'chart' | 'table')}
          />
        </div>
      }
    >
      <div className="mb-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
        <span className="flex items-center gap-2">
          <span className="h-[3px] w-5 rounded-full bg-[#b07a12]" />
          This period · <strong className="font-semibold text-[#171412]">{format(total)}</strong>
        </span>
        <span className="flex items-center gap-2 text-black/55">
          <span className="h-[2px] w-5 rounded-full bg-black/30" />
          Previous period · {format(previousTotal)}
        </span>
      </div>

      {view === 'table' ? (
        <div className="max-h-[280px] overflow-y-auto rounded-xl border border-black/[0.06]">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 bg-[#f7f3ec] text-xs uppercase tracking-[0.12em] text-black/50">
              <tr>
                <th className="px-4 py-2 font-medium">Day</th>
                <th className="px-4 py-2 text-right font-medium">Revenue</th>
                <th className="px-4 py-2 text-right font-medium">Orders</th>
              </tr>
            </thead>
            <tbody>
              {[...current].reverse().map((point) => (
                <tr key={point.date.toISOString()} className="border-t border-black/[0.05]">
                  <td className="px-4 py-2">{formatDay(point.date)}</td>
                  <td className="px-4 py-2 text-right tabular-nums">{formatEuro(point.revenue)}</td>
                  <td className="px-4 py-2 text-right tabular-nums">{point.orders}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div ref={ref} className="relative" style={{ height: HEIGHT }}>
          {width ? (
            <svg
              width={width}
              height={HEIGHT}
              role="img"
              aria-label={`${metric === 'revenue' ? 'Revenue' : 'Orders'} per day, ${format(total)} in total`}
              tabIndex={0}
              className="touch-pan-y outline-none"
              onPointerMove={(event) => setFromPointer(event.clientX, event.currentTarget.getBoundingClientRect())}
              onPointerLeave={() => setActive(null)}
              onFocus={() => setActive(current.length - 1)}
              onBlur={() => setActive(null)}
              onKeyDown={(event) => {
                if (event.key === 'ArrowLeft') setActive((index) => Math.max((index ?? 0) - 1, 0))
                if (event.key === 'ArrowRight') setActive((index) => Math.min((index ?? 0) + 1, current.length - 1))
              }}
            >
              <defs>
                <linearGradient id="revenue-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#b07a12" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#b07a12" stopOpacity="0" />
                </linearGradient>
              </defs>

              {ticks.map((tick) => (
                <g key={tick}>
                  <line x1={PAD.left} x2={width - PAD.right} y1={y(tick)} y2={y(tick)} stroke="#171412" strokeOpacity={tick ? 0.06 : 0.14} />
                  <text x={PAD.left - 10} y={y(tick)} dy="0.32em" textAnchor="end" className="fill-black/45 text-[11px] tabular-nums">
                    {metric === 'revenue' ? formatCompactEuro(tick) : tick}
                  </text>
                </g>
              ))}

              {current.map((point, index) =>
                (index % labelEvery === 0 && current.length - 1 - index >= labelEvery * 0.6) || index === current.length - 1 ? (
                  <text key={index} x={x(index)} y={HEIGHT - 8} textAnchor={index === current.length - 1 ? 'end' : index === 0 ? 'start' : 'middle'} className="fill-black/45 text-[11px]">
                    {formatDay(point.date)}
                  </text>
                ) : null,
              )}

              <path d={previousLine} fill="none" stroke="#171412" strokeOpacity="0.25" strokeWidth="2" />
              <path d={area} fill="url(#revenue-fill)" />
              <path d={line} fill="none" stroke="#b07a12" strokeWidth="2" strokeLinecap="round" />

              {active !== null ? (
                <g>
                  <line x1={x(active)} x2={x(active)} y1={PAD.top} y2={y(0)} stroke="#171412" strokeOpacity="0.25" />
                  <circle cx={x(active)} cy={y(previousValues[active] ?? 0)} r="4" fill="#fffdf9" stroke="#171412" strokeOpacity="0.4" strokeWidth="2" />
                  <circle cx={x(active)} cy={y(values[active])} r="5" fill="#b07a12" stroke="#fffdf9" strokeWidth="2" />
                </g>
              ) : null}
            </svg>
          ) : null}

          {active !== null && width ? (
            <div
              className="pointer-events-none absolute top-2 z-10 min-w-44 rounded-xl bg-[#171412] px-4 py-3 text-sm text-white shadow-xl"
              style={{
                left: Math.min(Math.max(x(active) - 88, 0), width - 184),
              }}
            >
              <p className="text-xs text-white/55">{formatDay(current[active].date)}</p>
              <p className="mt-1 flex items-center gap-2">
                <span className="h-[3px] w-3 rounded-full bg-[#e9cf8f]" />
                <strong className="font-semibold tabular-nums">{format(values[active])}</strong>
              </p>
              <p className="mt-1 flex items-center gap-2 text-white/60">
                <span className="h-[2px] w-3 rounded-full bg-white/40" />
                <span className="tabular-nums">{format(previousValues[active] ?? 0)}</span>
                <span className="text-xs">before</span>
              </p>
            </div>
          ) : null}
        </div>
      )}
    </Panel>
  )
}

export function Segmented({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: [string, string][]
  onChange: (value: string) => void
}) {
  return (
    <div role="group" aria-label={label} className="flex rounded-full bg-black/[0.05] p-1 text-xs font-medium">
      {options.map(([optionValue, optionLabel]) => (
        <button
          key={optionValue}
          type="button"
          aria-pressed={value === optionValue}
          onClick={() => onChange(optionValue)}
          className={`rounded-full px-3 py-1.5 transition ${
            value === optionValue ? 'bg-white text-[#171412] shadow-sm' : 'text-black/55 hover:text-black'
          }`}
        >
          {optionLabel}
        </button>
      ))}
    </div>
  )
}

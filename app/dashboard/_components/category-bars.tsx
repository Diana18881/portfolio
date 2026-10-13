import type { Category } from '../../ecommerce/_lib/products'
import { CATEGORY_COLORS, formatEuro } from '../_lib/data'
import Panel from './panel'

export default function CategoryBars({ data }: { data: { category: Category; revenue: number }[] }) {
  const total = data.reduce((sum, item) => sum + item.revenue, 0)
  const max = Math.max(...data.map((item) => item.revenue), 1)
  const sorted = [...data].sort((a, b) => b.revenue - a.revenue)

  return (
    <Panel title="Sales by category" description="Revenue from each category in the selected period, excluding refunds.">
      <div className="flex h-3 overflow-hidden rounded-full" aria-hidden="true">
        {data.map((item) => (
          <span
            key={item.category}
            className="h-full border-r-2 border-[#fffdf9] last:border-r-0"
            style={{ width: `${total ? (item.revenue / total) * 100 : 25}%`, backgroundColor: CATEGORY_COLORS[item.category] }}
          />
        ))}
      </div>
      <ul className="mt-6 space-y-5">
        {sorted.map((item) => (
          <li key={item.category} className="group" title={`${item.category}: ${formatEuro(item.revenue)}`}>
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="flex items-center gap-2 font-medium">
                <span className="h-2.5 w-2.5 rounded-[3px]" style={{ backgroundColor: CATEGORY_COLORS[item.category] }} />
                {item.category}
              </span>
              <span className="tabular-nums">
                <strong className="font-semibold">{formatEuro(item.revenue)}</strong>
                <span className="ml-2 text-black/45">{total ? Math.round((item.revenue / total) * 100) : 0}%</span>
              </span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-black/[0.05]">
              <div
                className="h-full rounded-full transition-[width] duration-700 ease-out group-hover:brightness-110"
                style={{ width: `${(item.revenue / max) * 100}%`, backgroundColor: CATEGORY_COLORS[item.category] }}
              />
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  )
}

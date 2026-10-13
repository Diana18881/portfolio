import Image from 'next/image'
import Link from 'next/link'
import type { Product } from '../../ecommerce/_lib/products'
import { formatEuro } from '../_lib/data'
import Panel from './panel'

export default function TopProducts({ data }: { data: { product: Product; units: number; revenue: number }[] }) {
  const max = Math.max(...data.map((item) => item.revenue), 1)

  return (
    <Panel id="products" title="Best sellers" description="The five products that earned the most in this period.">
      <ol className="space-y-4">
        {data.map((item, index) => (
          <li key={item.product.id} className="flex items-center gap-4">
            <span className="w-4 font-display text-lg text-black/35">{index + 1}</span>
            <Image width={96} height={120} src={item.product.images[0]} alt="" className="h-14 w-11 shrink-0 rounded-lg object-cover" />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-3">
                <Link href={`/ecommerce/product/${item.product.slug}`} className="truncate text-sm font-medium hover:underline">
                  {item.product.name}
                </Link>
                <span className="shrink-0 text-sm font-semibold tabular-nums">{formatEuro(item.revenue)}</span>
              </div>
              <div className="mt-1.5 flex items-center gap-3">
                <div className="h-1.5 flex-1 rounded-full bg-black/[0.05]">
                  <div className="h-full rounded-full bg-[#b07a12]" style={{ width: `${(item.revenue / max) * 100}%` }} />
                </div>
                <span className="shrink-0 text-xs text-black/45 tabular-nums">{item.units} sold</span>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </Panel>
  )
}

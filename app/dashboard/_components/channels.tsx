import { formatPercent } from '../_lib/data'
import Panel from './panel'

export default function Channels({ data }: { data: { channel: string; count: number; share: number }[] }) {
  const max = Math.max(...data.map((item) => item.share), 0.01)

  return (
    <Panel title="Where customers come from" description="Share of orders by the channel that brought the customer in.">
      <ul className="space-y-4">
        {data.map((item) => (
          <li key={item.channel}>
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className={item.channel.includes('live') ? 'font-medium text-[#2e7d4f]' : ''}>{item.channel}</span>
              <span className="tabular-nums">
                <strong className="font-semibold">{formatPercent(item.share)}</strong>
                <span className="ml-2 text-black/45">{item.count}</span>
              </span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-black/[0.05]">
              <div className="h-full rounded-full bg-[#171412]/80" style={{ width: `${(item.share / max) * 100}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  )
}

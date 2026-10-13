import type { OrderStatus } from '../_lib/data'

// Status colours are reserved for state and always come with an icon and a label.
const statusMeta: Record<OrderStatus, { className: string; icon: React.ReactNode }> = {
  Pending: {
    className: 'bg-[#b26b00]/10 text-[#8a5300]',
    icon: <path d="M8 4.5V8l2.5 1.5M14 8A6 6 0 1 1 2 8a6 6 0 0 1 12 0Z" />,
  },
  Paid: {
    className: 'bg-[#171412]/[0.07] text-[#171412]',
    icon: <path d="M3.5 8.5 6.5 11.5 12.5 4.5" />,
  },
  Shipped: {
    className: 'bg-[#3d5a80]/10 text-[#2f4766]',
    icon: <path d="M1.5 4.5h8v6h-8zM9.5 7h3l2 2v1.5h-5M4 12.5a1 1 0 1 0 0-.01M12 12.5a1 1 0 1 0 0-.01" />,
  },
  Delivered: {
    className: 'bg-[#2e7d4f]/10 text-[#24653f]',
    icon: <path d="M2.5 6.5 8 2l5.5 4.5V13h-11V6.5ZM5.5 9.5l2 2 3.5-4" />,
  },
  Refunded: {
    className: 'bg-[#b3261e]/10 text-[#9a1f18]',
    icon: <path d="M5.5 3.5 2.5 6.5l3 3M2.5 6.5H10a3.5 3.5 0 0 1 0 7H7" />,
  },
}

export default function StatusPill({ status }: { status: OrderStatus }) {
  const meta = statusMeta[status]

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${meta.className}`}>
      <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5 fill-none stroke-current" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        {meta.icon}
      </svg>
      {status}
    </span>
  )
}

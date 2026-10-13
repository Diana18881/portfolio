import { formatPrice } from '../_lib/products'

export default function Price({
  price,
  compareAt,
  size = 'md',
  showDiscount = true,
}: {
  price: number
  compareAt?: number
  size?: 'md' | 'lg'
  showDiscount?: boolean
}) {
  const large = size === 'lg'

  return (
    <span className="inline-flex items-baseline gap-2">
      <span className={`font-display font-semibold ${large ? 'text-4xl' : 'text-xl'} ${compareAt ? 'text-[#a3412b]' : ''}`}>
        {formatPrice(price)}
      </span>
      {compareAt ? (
        <>
          <s className={`text-black/40 ${large ? 'text-lg' : 'text-sm'}`}>
            <span className="sr-only">Was </span>
            {formatPrice(compareAt)}
          </s>
          {showDiscount ? (
            <span className="rounded-full bg-[#a3412b]/10 px-2 py-0.5 text-xs font-medium text-[#a3412b]">
              −{Math.round((1 - price / compareAt) * 100)}%
            </span>
          ) : null}
        </>
      ) : null}
    </span>
  )
}

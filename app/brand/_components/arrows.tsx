export const ArrowButton = ({
  direction,
  onClick,
  label,
  disabled,
  tone = 'dark',
}: {
  direction: 'prev' | 'next'
  onClick: () => void
  label: string
  disabled?: boolean
  tone?: 'dark' | 'light'
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    disabled={disabled}
    className={`grid h-12 w-12 place-items-center rounded-full border transition disabled:pointer-events-none disabled:opacity-30 ${
      tone === 'dark'
        ? 'border-[#14281f]/20 hover:bg-[#14281f] hover:text-[#f3ede2]'
        : 'border-white/25 hover:bg-[#f3ede2] hover:text-[#14281f]'
    }`}
  >
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d={direction === 'prev' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
    </svg>
  </button>
)

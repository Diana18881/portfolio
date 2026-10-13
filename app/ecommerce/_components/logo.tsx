import { useId } from 'react'

// Crescent mark built from two circles: "Luma" as in a soft light.
export default function Logo({ className = '' }: { className?: string }) {
  const id = useId()

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 32 32" aria-hidden="true" className="h-8 w-8">
        <defs>
          <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f0d78c" />
            <stop offset="55%" stopColor="#c99a3b" />
            <stop offset="100%" stopColor="#8c6a2f" />
          </linearGradient>
          <mask id={`${id}-crescent`}>
            <rect width="32" height="32" fill="white" />
            <circle cx="21" cy="12" r="10" fill="black" />
          </mask>
        </defs>
        <circle cx="16" cy="16" r="15" fill="none" stroke={`url(#${id}-gold)`} strokeWidth="1" />
        <circle cx="16" cy="16" r="11" fill={`url(#${id}-gold)`} mask={`url(#${id}-crescent)`} />
        <circle cx="23.5" cy="9" r="1.4" fill={`url(#${id}-gold)`} />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="font-display text-2xl font-semibold tracking-[0.32em]">LUMA</span>
        <span className="mt-0.5 hidden whitespace-nowrap text-[0.55rem] uppercase tracking-[0.5em] text-current/55 sm:block">
          Atelier · Berlin
        </span>
      </span>
    </span>
  )
}

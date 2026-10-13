export default function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <svg viewBox="0 0 40 40" aria-hidden="true" className="h-10 w-10">
        <circle cx="20" cy="20" r="19" fill="none" stroke="currentColor" strokeOpacity="0.5" />
        <path d="M20 31c-6-4-8.5-9.5-6.5-16 5 1.5 8 5.5 6.5 16Zm0 0c6-4 8.5-9.5 6.5-16-5 1.5-8 5.5-6.5 16Z" fill="#c8a46a" />
        <path d="M20 31V17" stroke="#14281f" strokeOpacity="0.6" strokeWidth="0.8" />
      </svg>
      <span className="leading-none">
        <span className="block font-display text-2xl font-medium tracking-[0.08em]">Maison Verde</span>
        <span className="mt-1 block text-[0.6rem] uppercase tracking-[0.45em] opacity-60">Restaurant · Berlin</span>
      </span>
    </span>
  )
}

export default function Panel({
  title,
  description,
  actions,
  children,
  className = '',
  id,
}: {
  title: string
  description?: string
  actions?: React.ReactNode
  children: React.ReactNode
  className?: string
  id?: string
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-24 rounded-[1.5rem] border border-black/[0.06] bg-[#fffdf9] p-5 shadow-[0_1px_2px_rgba(23,20,18,0.04),0_12px_32px_-16px_rgba(23,20,18,0.12)] md:p-6 ${className}`}
    >
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-md">
          <h2 className="font-display text-2xl font-medium leading-tight">{title}</h2>
          {description ? <p className="mt-1 text-sm leading-6 text-black/55">{description}</p> : null}
        </div>
        {actions}
      </div>
      {children}
    </section>
  )
}

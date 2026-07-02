import type { ReactNode } from 'react'

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  actions,
}: {
  eyebrow?: string
  title: ReactNode
  subtitle?: ReactNode
  actions?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && (
          <div className="text-eyebrow uppercase tracking-wide text-content-muted mb-1">
            {eyebrow}
          </div>
        )}
        <h1 className="font-display text-heading-xl sm:text-[34px] leading-tight text-content">
          {title}
        </h1>
        {subtitle && <p className="mt-1.5 text-body-md text-content-muted max-w-2xl">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-3 shrink-0">{actions}</div>}
    </div>
  )
}

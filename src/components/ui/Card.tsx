import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('card', className)}>{children}</div>
}

export function SectionTitle({
  eyebrow,
  title,
  action,
  icon,
}: {
  eyebrow?: string
  title: ReactNode
  action?: ReactNode
  icon?: ReactNode
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        {eyebrow && (
          <div className="text-micro-cap uppercase text-content-muted mb-1 flex items-center gap-1.5">
            {icon}
            {eyebrow}
          </div>
        )}
        <h2 className="text-heading-sm font-display text-content">{title}</h2>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

export interface TabItem {
  id: string
  label: string
  icon?: ReactNode
  count?: number
}

export function Tabs({
  tabs,
  value,
  onChange,
}: {
  tabs: TabItem[]
  value: string
  onChange: (id: string) => void
}) {
  return (
    <div className="border-b border-hairline overflow-x-auto">
      <div role="tablist" className="flex gap-1 min-w-max">
        {tabs.map((t) => {
          const active = t.id === value
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={active}
              onClick={() => onChange(t.id)}
              className={cn(
                'relative flex items-center gap-2 px-4 py-3 text-body-md font-medium whitespace-nowrap transition-colors',
                active ? 'text-content' : 'text-content-muted hover:text-content',
              )}
            >
              {t.icon}
              {t.label}
              {typeof t.count === 'number' && (
                <span className="rounded-xs bg-surface-3 px-1.5 text-caption text-content-muted">
                  {t.count}
                </span>
              )}
              {active && (
                <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-violet" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

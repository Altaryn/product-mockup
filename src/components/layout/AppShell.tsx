import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { cn } from '../../lib/cn'

export function AppShell() {
  const [navOpen, setNavOpen] = useState(false)
  // Colapsado por defecto, con opción de expandir (persistido).
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      const v = localStorage.getItem('pm-sidebar-collapsed')
      return v === null ? true : v === 'true'
    } catch {
      return true
    }
  })
  const toggleCollapse = () =>
    setCollapsed((c) => {
      const next = !c
      try {
        localStorage.setItem('pm-sidebar-collapsed', String(next))
      } catch {
        /* ignore */
      }
      return next
    })

  return (
    <div className="flex h-screen overflow-hidden bg-app-bg">
      {/* Desktop rail */}
      <div className="hidden shrink-0 lg:block">
        <Sidebar collapsed={collapsed} onToggleCollapse={toggleCollapse} />
      </div>

      {/* Mobile slide-over */}
      <div className={cn('fixed inset-0 z-50 lg:hidden', navOpen ? '' : 'pointer-events-none')}>
        <div
          className={cn(
            'absolute inset-0 bg-ink-deep/60 transition-opacity',
            navOpen ? 'opacity-100' : 'opacity-0',
          )}
          onClick={() => setNavOpen(false)}
        />
        <div
          className={cn(
            'absolute left-0 top-0 h-full transition-transform duration-200',
            navOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <Sidebar onNavigate={() => setNavOpen(false)} />
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenNav={() => setNavOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1200px] px-4 py-6 sm:px-6 sm:py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

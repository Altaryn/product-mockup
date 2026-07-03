import { NavLink } from 'react-router-dom'
import { cn } from '../../lib/cn'
import { useAppState } from '../../store'
import { getInitials } from '../../lib/user'
import {
  IconBox,
  IconSliders,
  IconCart,
  IconUsers,
  IconCube,
  IconExternal,
  IconChevronLeft,
  IconChevronRight,
} from '../ui/icons'

const nav = [
  { to: '/productos', label: 'Productos', icon: IconBox },
  { to: '/precios', label: 'Precios', icon: IconSliders },
  { to: '/pedidos', label: 'Solicitudes de pedido', icon: IconCart },
  { to: '/usuarios', label: 'Usuarios y permisos', icon: IconUsers },
]

/**
 * Persistent dark "night" rail (DESIGN dark polarity) — same in light & dark mode.
 * Collapses to an icon-only rail; `onToggleCollapse` expands it.
 */
export function Sidebar({
  onNavigate,
  collapsed = false,
  onToggleCollapse,
}: {
  onNavigate?: () => void
  collapsed?: boolean
  onToggleCollapse?: () => void
}) {
  const { currentUser } = useAppState()
  return (
    <aside
      className={cn(
        'starfield flex h-full flex-col bg-night text-on-primary transition-[width] duration-200',
        collapsed ? 'w-[76px]' : 'w-[264px]',
      )}
    >
      {/* Brand + collapse toggle */}
      <div className={cn('flex items-center py-5', collapsed ? 'justify-center px-3' : 'gap-2.5 px-5')}>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-on-dark-faint text-lime">
          <IconCube size={22} />
        </span>
        {!collapsed && (
          <div className="min-w-0 flex-1 leading-none">
            <div className="font-display text-[16px] font-semibold">
              Product <span className="lime-chip text-[16px]">Master</span>
            </div>
            <div className="mt-1 text-micro-cap uppercase text-on-dark-muted">Knauf · Procurement</div>
          </div>
        )}
        {!collapsed && onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            aria-label="Colapsar menú"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-on-dark-muted hover:bg-on-dark-faint/60 hover:text-on-primary"
          >
            <IconChevronLeft size={18} />
          </button>
        )}
      </div>

      {collapsed && onToggleCollapse && (
        <button
          onClick={onToggleCollapse}
          aria-label="Expandir menú"
          className="mx-auto mb-1 grid h-8 w-8 place-items-center rounded-md text-on-dark-muted hover:bg-on-dark-faint/60 hover:text-on-primary"
        >
          <IconChevronRight size={18} />
        </button>
      )}

      <nav className={cn('flex-1 space-y-1 py-2', collapsed ? 'px-2' : 'px-3')}>
        {nav.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              cn(
                'group relative flex items-center rounded-md text-body-md transition-colors',
                collapsed ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-2.5',
                isActive
                  ? 'bg-on-dark-faint text-on-primary'
                  : 'text-on-dark-muted hover:bg-on-dark-faint/50 hover:text-on-primary',
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-lime" />
                )}
                <Icon size={20} />
                {!collapsed && <span className="truncate">{label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Supplier Master — referenced module (not yet built) */}
      <div className={cn('pb-2', collapsed ? 'px-2' : 'px-3')}>
        <div
          title={collapsed ? 'Supplier Master · módulo externo (próximamente)' : undefined}
          className={cn(
            'flex items-center rounded-md border border-dashed border-hairline-violet text-on-dark-muted',
            collapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5',
          )}
        >
          <IconExternal size={18} />
          {!collapsed && (
            <div className="min-w-0">
              <div className="text-caption text-on-primary/90">Supplier Master</div>
              <div className="text-micro-cap uppercase">Módulo externo · próximamente</div>
            </div>
          )}
        </div>
      </div>

      <div className={cn('border-t border-hairline-violet py-4', collapsed ? 'px-2' : 'px-4')}>
        <div
          title={collapsed ? `${currentUser.name} · ${currentUser.role}` : undefined}
          className={cn('flex items-center', collapsed ? 'justify-center' : 'gap-3')}
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-violet-deep text-on-primary text-caption font-semibold">
            {getInitials(currentUser.name)}
          </span>
          {!collapsed && (
            <div className="min-w-0">
              <div className="truncate text-body-md text-on-primary">{currentUser.name}</div>
              <div className="text-micro-cap uppercase text-on-dark-muted">{currentUser.role}</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}

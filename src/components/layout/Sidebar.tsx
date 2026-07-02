import { NavLink } from 'react-router-dom'
import { cn } from '../../lib/cn'
import {
  IconBox,
  IconSliders,
  IconCart,
  IconUsers,
  IconCube,
  IconExternal,
} from '../ui/icons'

const nav = [
  { to: '/productos', label: 'Productos', icon: IconBox },
  { to: '/precios', label: 'Precios', icon: IconSliders },
  { to: '/pedidos', label: 'Solicitud de pedido', icon: IconCart },
  { to: '/usuarios', label: 'Usuarios y permisos', icon: IconUsers },
]

/** Persistent dark "night" rail (DESIGN dark polarity) — same in light & dark mode. */
export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <aside className="starfield flex h-full w-[264px] flex-col bg-night text-on-primary">
      {/* Brand — the single lime element (keyword chip, kept scarce) */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <span className="grid h-9 w-9 place-items-center rounded-md bg-on-dark-faint text-lime">
          <IconCube size={22} />
        </span>
        <div className="leading-none">
          <div className="font-display text-[19px] font-semibold">
            Product <span className="lime-chip text-[19px]">Master</span>
          </div>
          <div className="mt-1 text-micro-cap uppercase text-on-dark-muted">Knauf · Procurement</div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {nav.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'group relative flex items-center gap-3 rounded-md px-3 py-2.5 text-body-md transition-colors',
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
                <span className="truncate">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Supplier Master — referenced module (not yet built) */}
      <div className="px-3 pb-2">
        <div className="flex items-center gap-3 rounded-md border border-dashed border-hairline-violet px-3 py-2.5 text-on-dark-muted">
          <IconExternal size={18} />
          <div className="min-w-0">
            <div className="text-caption text-on-primary/90">Supplier Master</div>
            <div className="text-micro-cap uppercase">Módulo externo · próximamente</div>
          </div>
        </div>
      </div>

      <div className="border-t border-hairline-violet px-4 py-4">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-violet-deep text-on-primary text-caption font-semibold">
            CA
          </span>
          <div className="min-w-0">
            <div className="truncate text-body-md text-on-primary">Carlos Alfaro</div>
            <div className="text-micro-cap uppercase text-on-dark-muted">Administrador</div>
          </div>
        </div>
      </div>
    </aside>
  )
}

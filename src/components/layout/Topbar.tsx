import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../theme'
import { useAppState } from '../../store'
import { getInitials } from '../../lib/user'
import { IconMenu, IconSearch, IconSun, IconMoon } from '../ui/icons'

export function Topbar({ onOpenNav }: { onOpenNav: () => void }) {
  const { theme, toggle } = useTheme()
  const { currentUser } = useAppState()
  const navigate = useNavigate()
  const [q, setQ] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(`/productos?q=${encodeURIComponent(q.trim())}`)
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-hairline bg-surface/85 px-4 backdrop-blur-md sm:px-6">
      <button
        onClick={onOpenNav}
        className="grid h-10 w-10 place-items-center rounded-md text-content-muted hover:bg-surface-3 lg:hidden"
        aria-label="Abrir menú"
      >
        <IconMenu />
      </button>

      <form onSubmit={submit} className="relative hidden max-w-md flex-1 sm:block">
        <IconSearch
          size={18}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-content-faint"
        />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar producto por código o nombre…"
          className="w-full rounded-sm border border-hairline bg-surface-2 py-2 pl-10 pr-3 text-body-md text-content placeholder:text-content-faint focus:outline-none focus:ring-2 focus:ring-ring-focus"
        />
      </form>

      <div className="flex flex-1 items-center justify-end gap-2 sm:flex-none">
        <button
          onClick={toggle}
          className="grid h-10 w-10 place-items-center rounded-md text-content-muted hover:bg-surface-3"
          aria-label={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
          title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
        >
          {theme === 'dark' ? <IconSun /> : <IconMoon />}
        </button>
        <span
          title={`${currentUser.name} · ${currentUser.role}`}
          className="grid h-9 w-9 place-items-center rounded-full bg-violet-deep text-on-primary text-caption font-semibold"
        >
          {getInitials(currentUser.name)}
        </span>
      </div>
    </header>
  )
}

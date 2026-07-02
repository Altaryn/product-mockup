import type { PermissionArea, PermissionLevel } from '../../data/types'
import { permissionAreas, permissionLevelLabel } from '../../data/users.mock'
import { Segmented } from '../ui/Segmented'
import { cn } from '../../lib/cn'

const levelOpts: { value: PermissionLevel; label: string }[] = [
  { value: 'sin-acceso', label: '—' },
  { value: 'lectura', label: 'Ver' },
  { value: 'edicion', label: 'Editar' },
  { value: 'admin', label: 'Admin' },
]

/** Editable per-area permission matrix. */
export function PermissionMatrix({
  value,
  onChange,
}: {
  value: Record<PermissionArea, PermissionLevel>
  onChange: (v: Record<PermissionArea, PermissionLevel>) => void
}) {
  return (
    <div className="space-y-2.5">
      {permissionAreas.map((area) => (
        <div
          key={area}
          className="flex flex-col gap-2 rounded-md border border-hairline bg-surface-2 p-2.5 sm:flex-row sm:items-center sm:justify-between"
        >
          <span className="text-body-md font-medium text-content">{area}</span>
          <Segmented<PermissionLevel>
            size="sm"
            value={value[area]}
            onChange={(level) => onChange({ ...value, [area]: level })}
            options={levelOpts.map((o) => ({
              value: o.value,
              label: o.label,
              ariaLabel: `${area}: ${permissionLevelLabel[o.value]}`,
            }))}
          />
        </div>
      ))}
    </div>
  )
}

const toneByLevel: Record<PermissionLevel, string> = {
  'sin-acceso': 'bg-transparent text-content-faint border-hairline',
  lectura: 'bg-surface-3 text-content border-transparent',
  edicion: 'bg-violet/15 text-violet border-violet/25',
  admin: 'bg-violet text-on-primary border-transparent',
}
const abbr: Record<PermissionArea, string> = {
  Productos: 'Prod',
  Precios: 'Prec',
  Pedidos: 'Ped',
  Proveedores: 'Prov',
  Usuarios: 'Usr',
}

/** Compact read-only summary for table cells. */
export function PermissionSummary({
  permissions,
}: {
  permissions: Record<PermissionArea, PermissionLevel>
}) {
  return (
    <div className="flex flex-wrap gap-1">
      {permissionAreas.map((area) => (
        <span
          key={area}
          title={`${area}: ${permissionLevelLabel[permissions[area]]}`}
          className={cn(
            'inline-flex items-center rounded-xs border px-1.5 py-0.5 text-micro-cap uppercase',
            toneByLevel[permissions[area]],
          )}
        >
          {abbr[area]}
        </span>
      ))}
    </div>
  )
}

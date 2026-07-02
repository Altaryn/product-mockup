import type { VolumeTier } from '../../data/types'
import { Button } from '../ui/Button'
import { Input } from '../ui/Field'
import { IconPlus, IconTrash } from '../ui/icons'

/** Editable volume-tier grid (min / max / % discount). Local edits only. */
export function VolumeTierEditor({
  tiers,
  unit,
  onChange,
}: {
  tiers: VolumeTier[]
  unit: string
  onChange: (t: VolumeTier[]) => void
}) {
  const update = (i: number, patch: Partial<VolumeTier>) =>
    onChange(tiers.map((t, idx) => (idx === i ? { ...t, ...patch } : t)))
  const remove = (i: number) => onChange(tiers.filter((_, idx) => idx !== i))
  const add = () => {
    const last = tiers[tiers.length - 1]
    const min = last ? (last.max ?? last.min) + 1 : 1
    onChange([...tiers, { min, max: null, discountPct: 0 }])
  }

  return (
    <div className="space-y-3">
      <div className="hidden grid-cols-[1fr_1fr_1fr_auto] gap-2 px-1 text-micro-cap uppercase text-content-muted sm:grid">
        <span>Desde ({unit})</span>
        <span>Hasta ({unit})</span>
        <span>Descuento %</span>
        <span />
      </div>

      {tiers.map((t, i) => (
        <div key={i} className="grid grid-cols-2 gap-2 sm:grid-cols-[1fr_1fr_1fr_auto]">
          <Input
            type="number"
            min={0}
            value={t.min}
            aria-label="Desde"
            onChange={(e) => update(i, { min: Number(e.target.value) })}
          />
          <Input
            type="number"
            min={0}
            placeholder="Sin límite"
            value={t.max ?? ''}
            aria-label="Hasta"
            onChange={(e) =>
              update(i, { max: e.target.value === '' ? null : Number(e.target.value) })
            }
          />
          <Input
            type="number"
            min={0}
            max={100}
            value={t.discountPct}
            aria-label="Descuento"
            onChange={(e) => update(i, { discountPct: Number(e.target.value) })}
          />
          <button
            onClick={() => remove(i)}
            aria-label="Eliminar tramo"
            className="grid place-items-center rounded-md border border-hairline px-2 text-content-muted hover:border-pink hover:text-pink"
          >
            <IconTrash size={18} />
          </button>
        </div>
      ))}

      <Button variant="outline" size="sm" onClick={add}>
        <IconPlus size={16} /> Agregar tramo
      </Button>
    </div>
  )
}

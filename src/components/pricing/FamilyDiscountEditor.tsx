import type { FamilyDiscount } from '../../data/types'
import { Button } from '../ui/Button'
import { Input } from '../ui/Field'
import { IconPlus, IconTrash } from '../ui/icons'

/** Editable family/system grouping discounts. Local edits only. */
export function FamilyDiscountEditor({
  items,
  onChange,
}: {
  items: FamilyDiscount[]
  onChange: (v: FamilyDiscount[]) => void
}) {
  const update = (i: number, patch: Partial<FamilyDiscount>) =>
    onChange(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)))
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i))
  const add = () => onChange([...items, { family: '', discountPct: 0, note: '' }])

  return (
    <div className="space-y-3">
      {items.length === 0 && (
        <p className="text-body-md text-content-muted">Sin descuentos de agrupación. Agrega uno.</p>
      )}
      {items.map((it, i) => (
        <div key={i} className="rounded-lg border border-hairline bg-surface-2 p-3">
          <div className="grid grid-cols-[1fr_auto_auto] items-start gap-2">
            <Input
              value={it.family}
              placeholder="Nombre de la agrupación / sistema"
              aria-label="Familia"
              onChange={(e) => update(i, { family: e.target.value })}
            />
            <div className="flex items-center gap-1">
              <Input
                type="number"
                min={0}
                max={100}
                value={it.discountPct}
                aria-label="Descuento"
                className="w-20 text-right"
                onChange={(e) => update(i, { discountPct: Number(e.target.value) })}
              />
              <span className="text-body-md text-content-muted">%</span>
            </div>
            <button
              onClick={() => remove(i)}
              aria-label="Eliminar"
              className="grid h-[42px] place-items-center rounded-md border border-hairline px-2 text-content-muted hover:border-pink hover:text-pink"
            >
              <IconTrash size={18} />
            </button>
          </div>
          <Input
            value={it.note ?? ''}
            placeholder="Nota (opcional)"
            aria-label="Nota"
            className="mt-2"
            onChange={(e) => update(i, { note: e.target.value })}
          />
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={add}>
        <IconPlus size={16} /> Agregar descuento de familia
      </Button>
    </div>
  )
}

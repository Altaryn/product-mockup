import type { VolumeTier } from '../../data/types'
import { formatCLP, formatRange } from '../../lib/format'
import { cn } from '../../lib/cn'

/** Read-only volume-tier table: quantity range → % discount → resulting unit price. */
export function VolumeTierTable({
  tiers,
  listPrice,
  unit,
  highlightQty,
}: {
  tiers: VolumeTier[]
  listPrice: number
  unit: string
  highlightQty?: number
}) {
  if (tiers.length === 0) {
    return <p className="text-body-md text-content-muted">Sin tramos de descuento definidos.</p>
  }
  return (
    <div className="overflow-hidden rounded-lg border border-hairline">
      <table className="w-full text-body-md">
        <thead>
          <tr className="bg-surface-2 text-left text-caption uppercase tracking-wide text-content-muted">
            <th className="px-3 py-2 font-medium">Cantidad ({unit})</th>
            <th className="px-3 py-2 text-right font-medium">Descuento</th>
            <th className="px-3 py-2 text-right font-medium">Precio unit.</th>
          </tr>
        </thead>
        <tbody>
          {tiers.map((t, i) => {
            const active =
              highlightQty != null &&
              highlightQty >= t.min &&
              (t.max === null || highlightQty <= t.max)
            const price = Math.round(listPrice * (1 - t.discountPct / 100))
            return (
              <tr
                key={i}
                className={cn(
                  'border-t border-hairline',
                  active && 'bg-violet/10',
                )}
              >
                <td className="px-3 py-2 tabular-nums">
                  {formatRange(t.min, t.max)}
                  {active && (
                    <span className="ml-2 rounded-xs bg-violet px-1.5 py-0.5 text-micro-cap uppercase text-on-primary">
                      Aplicado
                    </span>
                  )}
                </td>
                <td className="px-3 py-2 text-right tabular-nums">
                  {t.discountPct > 0 ? (
                    <span className="font-medium text-content">−{t.discountPct}%</span>
                  ) : (
                    <span className="text-content-faint">—</span>
                  )}
                </td>
                <td className="px-3 py-2 text-right font-medium tabular-nums text-content">
                  {formatCLP(price)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

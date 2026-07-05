import { useNavigate } from 'react-router-dom'
import type { Product } from '../../data/types'
import { formatCLP } from '../../lib/format'
import { ProductStatusBadge, SourcingBadges } from '../ui/Badge'
import { IconChevronRight } from '../ui/icons'

export function ProductTable({ items }: { items: Product[] }) {
  const navigate = useNavigate()

  return (
    <div className="card overflow-hidden">
      <table className="w-full border-collapse text-body-md">
        <thead>
          <tr className="border-b border-hairline text-left text-caption uppercase tracking-wide text-content-muted">
            <th className="px-4 py-3 font-medium">Código</th>
            <th className="px-4 py-3 font-medium">Producto</th>
            <th className="hidden px-4 py-3 font-medium md:table-cell">Categoría</th>
            <th className="hidden px-4 py-3 font-medium lg:table-cell">Familia</th>
            <th className="hidden px-4 py-3 font-medium md:table-cell">Tipo</th>
            <th className="px-4 py-3 text-right font-medium">Precio base</th>
            <th className="px-4 py-3 font-medium">Estado</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {items.map((p) => (
            <tr
              key={p.id}
              onClick={() => navigate(`/productos/${p.id}`)}
              className="group cursor-pointer border-b border-hairline last:border-0 transition-colors hover:bg-surface-3/60"
            >
              <td className="px-4 py-3">
                <span className="font-mono text-code text-content-muted">{p.code}</span>
              </td>
              <td className="px-4 py-3">
                <div className="font-medium text-content">{p.name}</div>
                <div className="text-caption text-content-muted md:hidden">
                  {p.category} · {p.subcategory}
                </div>
              </td>
              <td className="hidden px-4 py-3 text-content-muted md:table-cell">{p.category}</td>
              <td className="hidden px-4 py-3 lg:table-cell">
                <span className="text-content-muted">{p.family}</span>
              </td>
              <td className="hidden px-4 py-3 md:table-cell">
                <SourcingBadges sourcing={p.sourcing} short />
              </td>
              <td className="px-4 py-3 text-right">
                <span className="font-medium text-content tabular-nums">{formatCLP(p.basePrice)}</span>
                <span className="text-caption text-content-faint"> /{p.unit}</span>
              </td>
              <td className="px-4 py-3">
                <ProductStatusBadge status={p.status} />
              </td>
              <td className="px-4 py-3 text-right">
                <IconChevronRight
                  size={18}
                  className="text-content-faint transition-transform group-hover:translate-x-0.5 group-hover:text-content"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

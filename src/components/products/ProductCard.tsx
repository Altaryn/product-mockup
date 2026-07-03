import { Link } from 'react-router-dom'
import type { Product } from '../../data/types'
import { formatCLP } from '../../lib/format'
import { ProductStatusBadge, SourcingBadge } from '../ui/Badge'
import { IconArrowRight } from '../ui/icons'

/** Category → short glyph for the card thumbnail (no photography in the system). */
const glyph: Record<string, string> = {
  'Placas de yeso': '▤',
  'Perfilería': '⌐',
  Aislación: '≋',
  'Pastas y compuestos': '◍',
  Cielos: '⊞',
  Fijaciones: '⌾',
}

export function ProductCard({ product: p }: { product: Product }) {
  return (
    <Link
      to={`/productos/${p.id}`}
      className="card group flex flex-col p-4 transition-shadow hover:shadow-e2"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-md bg-violet/10 font-display text-[18px] text-violet">
          {glyph[p.category] ?? '▣'}
        </span>
        <ProductStatusBadge status={p.status} />
      </div>

      <div className="mt-3 flex-1">
        <div className="font-mono text-caption text-content-faint">{p.code}</div>
        <h3 className="mt-0.5 text-body-strong text-content leading-snug">{p.name}</h3>
        <div className="mt-1 text-caption text-content-muted">
          {p.category} · {p.subcategory}
        </div>
        <div className="mt-2">
          <SourcingBadge sourcing={p.sourcing} />
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between border-t border-hairline pt-3">
        <div>
          <div className="text-micro-cap uppercase text-content-faint">Precio base</div>
          <div className="text-heading-sm font-display text-content tabular-nums">
            {formatCLP(p.basePrice)}
            <span className="text-caption font-sans font-normal text-content-faint"> /{p.unit}</span>
          </div>
        </div>
        <span className="grid h-9 w-9 place-items-center rounded-md bg-surface-3 text-content-muted transition-colors group-hover:bg-btn-primary group-hover:text-btn-primary-fg">
          <IconArrowRight size={18} />
        </span>
      </div>
    </Link>
  )
}

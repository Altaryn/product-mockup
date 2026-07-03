import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAppState } from '../store'
import { PageHeader } from '../components/ui/PageHeader'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input, Select } from '../components/ui/Field'
import { Segmented } from '../components/ui/Segmented'
import { ProductTable } from '../components/products/ProductTable'
import { ProductCard } from '../components/products/ProductCard'
import { IconSearch, IconGrid, IconRows, IconPlus, IconBox } from '../components/ui/icons'
import type { Product, ProductStatus } from '../data/types'

const uniq = (xs: string[]) => Array.from(new Set(xs))

type SortKey = 'updated' | 'name' | 'price-desc' | 'price-asc' | 'code'
type View = 'table' | 'cards'

const statusOptions: { value: ProductStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Todos los estados' },
  { value: 'activo', label: 'Activo' },
  { value: 'borrador', label: 'Borrador' },
  { value: 'descontinuado', label: 'Descontinuado' },
]

export function ProductsPage() {
  const { products } = useAppState()
  const [params] = useSearchParams()
  const [search, setSearch] = useState(params.get('q') ?? '')
  const [category, setCategory] = useState('all')
  const [family, setFamily] = useState('all')
  const [status, setStatus] = useState<ProductStatus | 'all'>('all')
  const [sort, setSort] = useState<SortKey>('updated')
  const [view, setView] = useState<View>('table')

  // Opciones de filtro derivadas del catálogo vivo (incluye productos creados).
  const categories = useMemo(() => uniq(products.map((p) => p.category)), [products])
  const families = useMemo(() => uniq(products.map((p) => p.family)), [products])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const rows = products.filter((p) => {
      if (q && !(`${p.code} ${p.name}`.toLowerCase().includes(q))) return false
      if (category !== 'all' && p.category !== category) return false
      if (family !== 'all' && p.family !== family) return false
      if (status !== 'all' && p.status !== status) return false
      return true
    })
    const sorted = [...rows]
    sorted.sort((a, b) => {
      switch (sort) {
        case 'name':
          return a.name.localeCompare(b.name, 'es')
        case 'code':
          return a.code.localeCompare(b.code, 'es')
        case 'price-desc':
          return b.basePrice - a.basePrice
        case 'price-asc':
          return a.basePrice - b.basePrice
        case 'updated':
        default:
          return b.updatedAt.localeCompare(a.updatedAt)
      }
    })
    return sorted
  }, [products, search, category, family, status, sort])

  const hasFilters = search || category !== 'all' || family !== 'all' || status !== 'all'
  const clear = () => {
    setSearch('')
    setCategory('all')
    setFamily('all')
    setStatus('all')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Catálogo"
        title="Productos"
        subtitle="Información técnica, comercial, logística y de proveedores centralizada por SKU."
        actions={
          <Link to="/productos/nuevo">
            <Button>
              <IconPlus size={18} /> Nuevo producto
            </Button>
          </Link>
        }
      />

      {/* Filter bar */}
      <Card className="p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <IconSearch
              size={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-content-faint"
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por código o nombre…"
              className="pl-10"
            />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:flex">
            <Select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Categoría">
              <option value="all">Categoría</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
            <Select value={family} onChange={(e) => setFamily(e.target.value)} aria-label="Familia">
              <option value="all">Familia</option>
              {families.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </Select>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value as ProductStatus | 'all')}
              aria-label="Estado"
            >
              {statusOptions.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </Select>
            <Select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} aria-label="Ordenar">
              <option value="updated">Actualización reciente</option>
              <option value="name">Nombre (A–Z)</option>
              <option value="price-desc">Precio (mayor)</option>
              <option value="price-asc">Precio (menor)</option>
              <option value="code">Código</option>
            </Select>
          </div>
        </div>
      </Card>

      {/* Result meta + view toggle */}
      <div className="flex items-center justify-between">
        <p className="text-body-md text-content-muted">
          <span className="font-medium text-content">{filtered.length}</span> de {products.length}{' '}
          productos
          {hasFilters && (
            <button onClick={clear} className="ml-3 text-caption text-violet underline hover:no-underline">
              Limpiar filtros
            </button>
          )}
        </p>
        <div className="hidden md:block">
          <Segmented<View>
            value={view}
            onChange={setView}
            options={[
              { value: 'table', icon: <IconRows size={18} />, ariaLabel: 'Vista tabla' },
              { value: 'cards', icon: <IconGrid size={18} />, ariaLabel: 'Vista tarjetas' },
            ]}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState onClear={clear} />
      ) : view === 'table' ? (
        <>
          <div className="hidden md:block">
            <ProductTable items={filtered} />
          </div>
          <CardGrid items={filtered} className="md:hidden" />
        </>
      ) : (
        <CardGrid items={filtered} />
      )}
    </div>
  )
}

function CardGrid({ items, className }: { items: Product[]; className?: string }) {
  return (
    <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 ${className ?? ''}`}>
      {items.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <Card className="flex flex-col items-center gap-3 px-6 py-16 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-full bg-surface-3 text-content-muted">
        <IconBox size={26} />
      </span>
      <h3 className="text-heading-sm font-display text-content">Sin resultados</h3>
      <p className="max-w-sm text-body-md text-content-muted">
        Ningún producto coincide con los filtros actuales. Ajusta la búsqueda o límpialos.
      </p>
      <Button variant="outline" onClick={onClear}>
        Limpiar filtros
      </Button>
    </Card>
  )
}

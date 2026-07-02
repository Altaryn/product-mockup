import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { products, productById } from '../data/products.mock'
import { clients } from '../data/clients.mock'
import { resolvePrice } from '../lib/pricing'
import { formatCLP } from '../lib/format'
import { PageHeader } from '../components/ui/PageHeader'
import { Card, SectionTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input, SelectField } from '../components/ui/Field'
import { Badge } from '../components/ui/Badge'
import { IconSearch, IconCart, IconTrash, IconCheck, IconPlus } from '../components/ui/icons'

interface Line {
  productId: string
  qty: number
}

export function OrderRequestPage() {
  const [params] = useSearchParams()
  const [clientId, setClientId] = useState('CL-101')
  const [query, setQuery] = useState('')
  const [lines, setLines] = useState<Line[]>([])
  const [confirmed, setConfirmed] = useState<string | null>(null)

  // Prefill from ?product=
  useEffect(() => {
    const pid = params.get('product')
    if (pid && productById(pid)) setLines([{ productId: pid, qty: 100 }])
  }, [params])

  const addLine = (productId: string) => {
    setConfirmed(null)
    setLines((ls) =>
      ls.some((l) => l.productId === productId)
        ? ls.map((l) => (l.productId === productId ? { ...l, qty: l.qty + 100 } : l))
        : [...ls, { productId, qty: 100 }],
    )
    setQuery('')
  }
  const setQty = (productId: string, qty: number) => {
    setConfirmed(null)
    setLines((ls) => ls.map((l) => (l.productId === productId ? { ...l, qty: Math.max(0, qty) } : l)))
  }
  const remove = (productId: string) => {
    setConfirmed(null)
    setLines((ls) => ls.filter((l) => l.productId !== productId))
  }

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return products
      .filter((p) => `${p.code} ${p.name}`.toLowerCase().includes(q))
      .slice(0, 6)
  }, [query])

  const priced = lines.map((l) => {
    const product = productById(l.productId)!
    return { line: l, product, price: resolvePrice(product, clientId, l.qty) }
  })
  const total = priced.reduce((sum, p) => sum + p.price.lineTotal, 0)

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Compras"
        title="Solicitud de pedido"
        subtitle="Busca productos, define cantidades y revisa el precio unitario vigente según cliente y tramo antes de confirmar."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Left: client + search */}
        <div className="space-y-4 lg:col-span-1">
          <Card className="p-5">
            <SelectField
              label="Cliente de la solicitud"
              value={clientId}
              onChange={(e) => {
                setClientId(e.target.value)
                setConfirmed(null)
              }}
            >
              {clients
                .filter((c) => c.id !== 'CL-000')
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </SelectField>
            <p className="mt-2 text-caption text-content-faint">
              El precio unitario se resuelve con la lista de este cliente y el tramo por volumen.
            </p>
          </Card>

          <Card className="p-5">
            <SectionTitle eyebrow="Agregar" title="Buscar producto" icon={<IconSearch size={13} />} />
            <div className="relative mt-3">
              <IconSearch
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-content-faint"
              />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Código o nombre…"
                className="pl-10"
              />
            </div>

            {matches.length > 0 && (
              <ul className="mt-2 divide-y divide-hairline overflow-hidden rounded-lg border border-hairline">
                {matches.map((p) => (
                  <li key={p.id}>
                    <button
                      onClick={() => addLine(p.id)}
                      className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left hover:bg-surface-3"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-body-md text-content">{p.name}</span>
                        <span className="font-mono text-caption text-content-faint">{p.code}</span>
                      </span>
                      <span className="flex shrink-0 items-center gap-2 text-caption text-content-muted">
                        {formatCLP(p.basePrice)}
                        <IconPlus size={16} />
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {query && matches.length === 0 && (
              <p className="mt-2 text-caption text-content-muted">Sin coincidencias para “{query}”.</p>
            )}
          </Card>
        </div>

        {/* Right: cart */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between gap-3 border-b border-hairline px-5 py-4">
              <div className="flex items-center gap-2">
                <IconCart size={20} className="text-content-muted" />
                <h2 className="text-heading-sm font-display text-content">Líneas de pedido</h2>
                <Badge tone="neutral">{lines.length}</Badge>
              </div>
            </div>

            {priced.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-surface-3 text-content-muted">
                  <IconCart size={26} />
                </span>
                <p className="text-body-md text-content-muted">
                  Aún no hay líneas. Busca un producto y agrégalo.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-hairline">
                {/* header row (desktop) */}
                <div className="hidden grid-cols-[1fr_120px_140px_140px_40px] gap-3 px-5 py-2.5 text-micro-cap uppercase text-content-muted sm:grid">
                  <span>Producto</span>
                  <span className="text-center">Cantidad</span>
                  <span className="text-right">Precio unit.</span>
                  <span className="text-right">Subtotal</span>
                  <span />
                </div>

                {priced.map(({ line, product, price }) => (
                  <div
                    key={line.productId}
                    className="grid grid-cols-2 items-center gap-3 px-5 py-3 sm:grid-cols-[1fr_120px_140px_140px_40px]"
                  >
                    <div className="col-span-2 min-w-0 sm:col-span-1">
                      <div className="truncate text-body-md font-medium text-content">{product.name}</div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-caption text-content-faint">{product.code}</span>
                        {price.discountPct > 0 && (
                          <Badge tone="violet">−{price.discountPct}% volumen</Badge>
                        )}
                      </div>
                    </div>

                    <div className="sm:justify-self-center">
                      <div className="flex items-center rounded-sm border border-hairline">
                        <Input
                          type="number"
                          min={0}
                          value={line.qty}
                          onChange={(e) => setQty(line.productId, Number(e.target.value))}
                          className="w-full border-0 bg-transparent text-center tabular-nums focus:ring-0"
                        />
                      </div>
                      <div className="mt-0.5 text-center text-micro-cap uppercase text-content-faint">
                        {product.unit}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-body-md font-medium tabular-nums text-content">
                        {formatCLP(price.unitPrice)}
                      </div>
                      {price.fromClientList && (
                        <div className="text-micro-cap uppercase text-violet">Precio cliente</div>
                      )}
                    </div>

                    <div className="text-right text-body-md font-semibold tabular-nums text-content">
                      {formatCLP(price.lineTotal)}
                    </div>

                    <button
                      onClick={() => remove(line.productId)}
                      aria-label="Quitar línea"
                      className="justify-self-end text-content-muted hover:text-pink"
                    >
                      <IconTrash size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Footer / totals */}
            <div className="border-t border-hairline bg-surface-2 px-5 py-4">
              <div className="flex items-center justify-between">
                <span className="text-body-md text-content-muted">Total estimado</span>
                <span className="font-display text-heading-md text-content tabular-nums">
                  {formatCLP(total)}
                </span>
              </div>
              <div className="mt-4 flex flex-col-reverse items-stretch gap-2 sm:flex-row sm:justify-end">
                {confirmed ? (
                  <div className="flex items-center gap-2 rounded-md bg-violet/10 px-4 py-2 text-body-md text-content">
                    <IconCheck size={18} className="text-violet" />
                    Solicitud <span className="font-mono font-medium">{confirmed}</span> creada
                  </div>
                ) : (
                  <Button
                    disabled={priced.length === 0}
                    onClick={() =>
                      setConfirmed(`SP-2026-${String(1040 + lines.length * 7).padStart(4, '0')}`)
                    }
                  >
                    <IconCheck size={18} /> Confirmar solicitud
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

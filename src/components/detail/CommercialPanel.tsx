import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '../../data/types'
import { clients } from '../../data/clients.mock'
import { resolvePrice } from '../../lib/pricing'
import { formatCLP } from '../../lib/format'
import { Card, SectionTitle } from '../ui/Card'
import { SelectField, Field, Input } from '../ui/Field'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { VolumeTierTable } from './VolumeTierTable'
import { IconLayers, IconSliders, IconCart } from '../ui/icons'

export function CommercialPanel({ product }: { product: Product }) {
  const [clientId, setClientId] = useState('CL-000')
  const [qty, setQty] = useState(300)
  const res = resolvePrice(product, clientId, qty)

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      {/* Price simulator */}
      <Card className="p-5 lg:col-span-3">
        <SectionTitle
          eyebrow="Lista de precios"
          title="Precio vigente por cliente"
          icon={<IconSliders size={13} />}
        />
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <SelectField
            label="Cliente / lista"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
          >
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </SelectField>
          <Field label={`Cantidad (${product.unit})`}>
            <Input
              type="number"
              min={0}
              value={qty}
              onChange={(e) => setQty(Math.max(0, Number(e.target.value)))}
            />
          </Field>
        </div>

        {/* Resolved price readout */}
        <div className="mt-4 rounded-lg border border-hairline bg-surface-2 p-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="text-micro-cap uppercase text-content-muted">Precio unitario vigente</div>
              <div className="mt-0.5 font-display text-[26px] leading-none text-content tabular-nums">
                {formatCLP(res.unitPrice)}
                <span className="text-body-md font-sans font-normal text-content-faint">
                  {' '}
                  /{product.unit}
                </span>
              </div>
            </div>
            <div className="text-right text-caption text-content-muted">
              <div>
                Lista: <span className="text-content">{formatCLP(res.listPrice)}</span>
                {res.fromClientList ? (
                  <Badge tone="violet" className="ml-2">
                    Precio cliente
                  </Badge>
                ) : (
                  <Badge tone="muted" className="ml-2">
                    Lista general
                  </Badge>
                )}
              </div>
              {res.discountPct > 0 && (
                <div className="mt-1">
                  Tramo volumen: <span className="text-content">−{res.discountPct}%</span>
                </div>
              )}
              <div className="mt-1">
                Total {qty} {product.unit}:{' '}
                <span className="font-medium text-content">{formatCLP(res.lineTotal)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <h4 className="mb-2 text-micro-cap uppercase text-content-muted">
            Tramos de descuento por volumen
          </h4>
          <VolumeTierTable
            tiers={product.commercial.volumeTiers}
            listPrice={res.listPrice}
            unit={product.unit}
            highlightQty={qty}
          />
        </div>
      </Card>

      {/* Family discounts + actions */}
      <div className="space-y-4 lg:col-span-2">
        <Card className="p-5">
          <SectionTitle
            eyebrow="Agrupación de familia"
            title="Descuentos por familia"
            icon={<IconLayers size={13} />}
          />
          <div className="mt-4 space-y-2.5">
            {product.commercial.familyDiscounts.length === 0 && (
              <p className="text-body-md text-content-muted">
                Este producto no participa en descuentos por agrupación.
              </p>
            )}
            {product.commercial.familyDiscounts.map((f) => (
              <div
                key={f.family}
                className="flex items-start justify-between gap-3 rounded-md border border-hairline bg-surface-2 p-3"
              >
                <div className="min-w-0">
                  <div className="text-body-md font-medium text-content">{f.family}</div>
                  {f.note && <div className="text-caption text-content-muted">{f.note}</div>}
                </div>
                <span className="shrink-0 font-display text-heading-sm text-violet tabular-nums">
                  −{f.discountPct}%
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h4 className="text-micro-cap uppercase text-content-muted">Acciones</h4>
          <div className="mt-3 flex flex-col gap-2.5">
            <Link to={`/pedidos/nuevo?product=${product.id}`}>
              <Button className="w-full">
                <IconCart size={18} /> Crear solicitud de pedido
              </Button>
            </Link>
            <Link to={`/precios?product=${product.id}`}>
              <Button variant="outline" className="w-full">
                <IconSliders size={18} /> Editar precios y tramos
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}

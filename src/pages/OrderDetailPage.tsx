import { Link, useParams } from 'react-router-dom'
import { useAppState } from '../store'
import { clientById } from '../data/clients.mock'
import { formatCLP, formatDate, formatNumber } from '../lib/format'
import { priceOrder } from '../lib/orders'
import { getInitials } from '../lib/user'
import { Card, SectionTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge, OrderStatusBadge } from '../components/ui/Badge'
import { IconChevronRight, IconCart, IconTruck } from '../components/ui/icons'

const fmtPallets = (n: number) => n.toLocaleString('es-CL', { maximumFractionDigits: 1 })

export function OrderDetailPage() {
  const { id } = useParams()
  const { orders, users } = useAppState()
  const order = orders.find((o) => o.id === id)

  if (!order) {
    return (
      <Card className="flex flex-col items-center gap-3 px-6 py-16 text-center">
        <h2 className="text-heading-md font-display text-content">Solicitud no encontrada</h2>
        <p className="text-body-md text-content-muted">La solicitud solicitada no existe en el historial.</p>
        <Link to="/pedidos">
          <Button variant="outline">Volver a Solicitudes</Button>
        </Link>
      </Card>
    )
  }

  const creator = users.find((u) => u.id === order.userId)
  const client = clientById(order.clientId)
  const pr = priceOrder(order)

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-caption text-content-muted">
        <Link to="/pedidos" className="hover:text-content">
          Solicitudes de pedido
        </Link>
        <IconChevronRight size={14} />
        <span className="text-content">{order.id}</span>
      </nav>

      {/* Header: meta + total */}
      <Card className="p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-heading-sm text-content">{order.id}</span>
              <OrderStatusBadge status={order.status} />
            </div>
            <div className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-3">
              <Meta label="Solicitante">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-violet-deep text-[11px] font-semibold text-on-primary">
                    {getInitials(creator?.name ?? '?')}
                  </span>
                  <div className="min-w-0">
                    <div className="font-medium text-content">{creator?.name ?? '—'}</div>
                    <div className="text-caption text-content-muted">{creator?.role ?? ''}</div>
                  </div>
                </div>
              </Meta>
              <Meta label="Cliente">
                <div className="font-medium text-content">{client?.name ?? order.clientId}</div>
                {client && <div className="text-caption text-content-muted">{client.priceListName}</div>}
              </Meta>
              <Meta label="Fecha de solicitud">
                <div className="font-medium text-content">{formatDate(order.date)}</div>
              </Meta>
            </div>
          </div>

          <div className="shrink-0 rounded-lg border border-hairline bg-surface-2 p-4 lg:text-right">
            <div className="text-micro-cap uppercase text-content-faint">Monto total</div>
            <div className="font-display text-heading-xl text-content tabular-nums">
              {formatCLP(pr.total)}
            </div>
            <div className="mt-1 text-caption text-content-muted">
              {pr.itemsCount} {pr.itemsCount === 1 ? 'línea' : 'líneas'} de pedido
            </div>
          </div>
        </div>
      </Card>

      {/* Line items */}
      <Card className="overflow-hidden">
        <div className="flex items-center gap-2 border-b border-hairline px-5 py-4">
          <IconCart size={20} className="text-content-muted" />
          <h2 className="text-heading-sm font-display text-content">Productos solicitados</h2>
          <Badge tone="neutral">{pr.itemsCount}</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-body-md">
            <thead>
              <tr className="border-b border-hairline text-left text-caption uppercase tracking-wide text-content-muted">
                <th className="px-5 py-2.5 font-medium">Producto</th>
                <th className="px-5 py-2.5 text-right font-medium">Cantidad</th>
                <th className="px-5 py-2.5 text-right font-medium">P. unitario</th>
                <th className="px-5 py-2.5 text-right font-medium">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {pr.lines.map((l) => (
                <tr key={l.productId} className="border-b border-hairline last:border-0">
                  <td className="px-5 py-3">
                    <Link
                      to={`/productos/${l.productId}`}
                      className="font-medium text-content hover:text-violet"
                    >
                      {l.product.name}
                    </Link>
                    <div className="font-mono text-caption text-content-faint">{l.product.code}</div>
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums text-content">
                    {formatNumber(l.qty)}
                    <span className="text-caption text-content-faint"> {l.product.unit}</span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="tabular-nums text-content">{formatCLP(l.unitPrice)}</div>
                    <div className="flex justify-end gap-1.5">
                      {l.fromClientList && (
                        <span className="text-micro-cap uppercase text-violet">Precio cliente</span>
                      )}
                      {l.discountPct > 0 && <Badge tone="violet">−{l.discountPct}%</Badge>}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right font-semibold tabular-nums text-content">
                    {formatCLP(l.subtotal)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-surface-2">
                <td className="px-5 py-3 text-body-md text-content-muted" colSpan={3}>
                  Total de la solicitud
                </td>
                <td className="px-5 py-3 text-right font-display text-heading-sm text-content tabular-nums">
                  {formatCLP(pr.total)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>

      {/* Logistics summary */}
      <Card className="p-5">
        <SectionTitle eyebrow="Logística" title="Resumen de carga" icon={<IconTruck size={13} />} />
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Líneas" value={formatNumber(pr.itemsCount)} />
          <Stat label="Total pallets" value={fmtPallets(pr.totalPallets)} />
          <Stat label="Peso total" value={`${formatNumber(Math.round(pr.totalWeightKg))} kg`} />
          <Stat label="Monto total" value={formatCLP(pr.total)} />
        </div>
      </Card>

      <div>
        <Link to="/pedidos">
          <Button variant="outline">← Volver a Solicitudes</Button>
        </Link>
      </div>
    </div>
  )
}

function Meta({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1 text-micro-cap uppercase text-content-faint">{label}</div>
      {children}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-hairline bg-surface-2 p-3 text-center">
      <div className="text-micro-cap uppercase text-content-faint">{label}</div>
      <div className="mt-0.5 font-display text-heading-sm text-content tabular-nums">{value}</div>
    </div>
  )
}

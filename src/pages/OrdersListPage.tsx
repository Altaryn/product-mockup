import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppState } from '../store'
import { clientById } from '../data/clients.mock'
import { orderStatuses } from '../data/orders.mock'
import type { OrderStatus } from '../data/types'
import { formatCLP, formatDate, formatNumber } from '../lib/format'
import { priceOrder } from '../lib/orders'
import { getInitials } from '../lib/user'
import { PageHeader } from '../components/ui/PageHeader'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { SelectField } from '../components/ui/Field'
import { Badge, OrderStatusBadge } from '../components/ui/Badge'
import { IconPlus, IconCart, IconChevronRight } from '../components/ui/icons'

export function OrdersListPage() {
  const { currentUser, setCurrentUserId, users, orders } = useAppState()
  const navigate = useNavigate()
  const isAdmin = currentUser.role === 'Administrador'
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')

  const userById = useMemo(() => new Map(users.map((u) => [u.id, u])), [users])

  // Admin ve todos los pedidos; los solicitantes solo los propios.
  const scoped = useMemo(
    () => (isAdmin ? orders : orders.filter((o) => o.userId === currentUser.id)),
    [isAdmin, orders, currentUser.id],
  )
  const visible = useMemo(() => {
    const rows = statusFilter === 'all' ? scoped : scoped.filter((o) => o.status === statusFilter)
    return [...rows].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id))
  }, [scoped, statusFilter])

  const totalMonto = scoped.reduce((s, o) => s + priceOrder(o).total, 0)
  const pendientes = scoped.filter((o) => o.status === 'pendiente').length
  const entregadas = scoped.filter((o) => o.status === 'entregada').length

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Compras"
        title="Solicitudes de pedido"
        subtitle="Historial de solicitudes generadas, como respaldo y seguimiento. Los administradores ven todos los pedidos; los solicitantes, solo los propios."
        actions={
          <Link to="/pedidos/nuevo">
            <Button>
              <IconPlus size={18} /> Solicitud de pedido
            </Button>
          </Link>
        }
      />

      {/* Controls: perfil activo (demo) + filtro estado */}
      <Card className="p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <SelectField
            label="Perfil activo (demo)"
            hint="Simula el usuario con el que navegas para ver la visibilidad por rol."
            value={currentUser.id}
            onChange={(e) => setCurrentUserId(e.target.value)}
          >
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} · {u.role}
              </option>
            ))}
          </SelectField>
          <SelectField
            label="Estado"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
          >
            <option value="all">Todos los estados</option>
            {orderStatuses.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </SelectField>
        </div>
        <div className="mt-3 flex items-center gap-2 text-caption text-content-muted">
          <Badge tone={isAdmin ? 'violet' : 'neutral'}>
            {isAdmin ? 'Vista administrador' : 'Vista solicitante'}
          </Badge>
          {isAdmin
            ? 'Mostrando pedidos de todos los usuarios.'
            : `Mostrando solo los pedidos de ${currentUser.name}.`}
        </div>
      </Card>

      {/* Stat strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Pedidos" value={formatNumber(scoped.length)} />
        <StatCard label="Monto total" value={formatCLP(totalMonto)} />
        <StatCard label="Pendientes" value={formatNumber(pendientes)} />
        <StatCard label="Entregadas" value={formatNumber(entregadas)} />
      </div>

      {visible.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 px-6 py-16 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-surface-3 text-content-muted">
            <IconCart size={26} />
          </span>
          <h3 className="text-heading-sm font-display text-content">Sin solicitudes</h3>
          <p className="max-w-sm text-body-md text-content-muted">
            {isAdmin
              ? 'Aún no hay pedidos con este filtro.'
              : 'No has generado solicitudes con este filtro.'}
          </p>
          <Link to="/pedidos/nuevo">
            <Button variant="outline">
              <IconPlus size={16} /> Nueva solicitud
            </Button>
          </Link>
        </Card>
      ) : (
        <>
          {/* Desktop table */}
          <Card className="hidden overflow-hidden md:block">
            <table className="w-full text-body-md">
              <thead>
                <tr className="border-b border-hairline text-left text-caption uppercase tracking-wide text-content-muted">
                  <th className="px-4 py-3 font-medium">N°</th>
                  <th className="px-4 py-3 font-medium">Solicitante</th>
                  <th className="px-4 py-3 font-medium">Cliente</th>
                  <th className="px-4 py-3 font-medium">Fecha</th>
                  <th className="px-4 py-3 text-center font-medium">Ítems</th>
                  <th className="px-4 py-3 text-right font-medium">Total</th>
                  <th className="px-4 py-3 font-medium">Estado</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {visible.map((o) => {
                  const u = userById.get(o.userId)
                  const pr = priceOrder(o)
                  return (
                    <tr
                      key={o.id}
                      onClick={() => navigate(`/pedidos/${o.id}`)}
                      className="group cursor-pointer border-b border-hairline last:border-0 transition-colors hover:bg-surface-3/60"
                    >
                      <td className="px-4 py-3">
                        <span className="font-mono text-code text-content">{o.id}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-violet-deep text-[11px] font-semibold text-on-primary">
                            {getInitials(u?.name ?? '?')}
                          </span>
                          <div className="min-w-0">
                            <div className="font-medium text-content">{u?.name ?? '—'}</div>
                            <div className="text-caption text-content-muted">{u?.role ?? ''}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-content-muted">{clientById(o.clientId)?.name ?? o.clientId}</td>
                      <td className="px-4 py-3 text-content-muted">{formatDate(o.date)}</td>
                      <td className="px-4 py-3 text-center tabular-nums text-content-muted">{pr.itemsCount}</td>
                      <td className="px-4 py-3 text-right font-medium tabular-nums text-content">
                        {formatCLP(pr.total)}
                      </td>
                      <td className="px-4 py-3">
                        <OrderStatusBadge status={o.status} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <IconChevronRight
                          size={18}
                          className="text-content-faint transition-transform group-hover:translate-x-0.5 group-hover:text-content"
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </Card>

          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {visible.map((o) => {
              const u = userById.get(o.userId)
              const pr = priceOrder(o)
              return (
                <Link key={o.id} to={`/pedidos/${o.id}`} className="card block p-4 hover:shadow-e2">
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-mono text-code text-content">{o.id}</span>
                    <OrderStatusBadge status={o.status} />
                  </div>
                  <div className="mt-3 flex items-center gap-2.5">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-violet-deep text-[11px] font-semibold text-on-primary">
                      {getInitials(u?.name ?? '?')}
                    </span>
                    <div className="min-w-0">
                      <div className="font-medium text-content">{u?.name ?? '—'}</div>
                      <div className="text-caption text-content-muted">{u?.role ?? ''}</div>
                    </div>
                  </div>
                  <dl className="mt-3 grid grid-cols-2 gap-2 text-caption">
                    <Row label="Cliente" value={clientById(o.clientId)?.name ?? o.clientId} />
                    <Row label="Fecha" value={formatDate(o.date)} />
                    <Row label="Ítems" value={String(pr.itemsCount)} />
                    <Row label="Total" value={formatCLP(pr.total)} />
                  </dl>
                </Link>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-4">
      <div className="text-micro-cap uppercase text-content-faint">{label}</div>
      <div className="mt-1 font-display text-heading-md text-content tabular-nums">{value}</div>
    </Card>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-content-muted">{label}</dt>
      <dd className="font-medium text-content">{value}</dd>
    </div>
  )
}

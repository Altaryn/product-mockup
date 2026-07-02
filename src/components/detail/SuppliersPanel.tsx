import { supplierById } from '../../data/suppliers.mock'
import { Card, SectionTitle } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { IconBuilding, IconInfo, IconExternal } from '../ui/icons'

/**
 * Suppliers are OWNED BY the future "Supplier Master" module. Here we only
 * render referenced mock data. Integration point: replace supplierById() with
 * a call to Supplier Master (e.g. supplierMaster.getMany(product.supplierIds)).
 */
export function SuppliersPanel({ supplierIds }: { supplierIds: string[] }) {
  const suppliers = supplierIds.map(supplierById).filter(Boolean)

  return (
    <Card className="p-5">
      <SectionTitle
        eyebrow="Datos referenciados"
        title="Proveedores del producto"
        icon={<IconBuilding size={13} />}
        action={
          <span className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-hairline-strong px-2.5 py-1 text-caption text-content-muted">
            <IconExternal size={14} /> Supplier Master
          </span>
        }
      />

      {/* Cross-module provenance banner */}
      <div className="mt-4 flex items-start gap-2.5 rounded-md bg-violet/8 p-3 text-caption text-content-muted">
        <IconInfo size={16} className="mt-0.5 shrink-0 text-violet" />
        <p>
          Esta información proviene del módulo <span className="font-medium text-content">Supplier Master</span>{' '}
          (aún no implementado). Se muestra con datos de ejemplo; en producción se resolvería por API a
          partir de los <code className="font-mono text-code text-content">supplierIds</code> del producto.
        </p>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {suppliers.map((s) => (
          <div key={s!.id} className="rounded-lg border border-hairline bg-surface-2 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-body-strong text-content">{s!.name}</div>
                <div className="mt-0.5 font-mono text-caption text-content-faint">{s!.id}</div>
              </div>
              <Badge tone={s!.type === 'interno' ? 'violet' : 'neutral'}>
                {s!.type === 'interno' ? 'Interno' : 'Externo'}
              </Badge>
            </div>
            <dl className="mt-3 space-y-1.5 text-caption">
              <Row label="Categoría" value={s!.category} />
              <Row label="Subcategoría" value={s!.subcategory} />
              <Row label="Origen" value={s!.country} />
              <Row label="Lead time" value={`${s!.leadTimeDays} días`} />
            </dl>
          </div>
        ))}
      </div>
    </Card>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-content-muted">{label}</dt>
      <dd className="text-right font-medium text-content">{value}</dd>
    </div>
  )
}

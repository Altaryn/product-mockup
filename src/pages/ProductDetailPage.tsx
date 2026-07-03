import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAppState } from '../store'
import { formatCLP, formatDate } from '../lib/format'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge, ProductStatusBadge, SourcingBadge } from '../components/ui/Badge'
import { Tabs, type TabItem } from '../components/ui/Tabs'
import { TechSpecs } from '../components/detail/TechSpecs'
import { CommercialPanel } from '../components/detail/CommercialPanel'
import { LogisticsPanel } from '../components/detail/LogisticsPanel'
import { DocumentationPanel } from '../components/detail/DocumentationPanel'
import { SuppliersPanel } from '../components/detail/SuppliersPanel'
import { getDocuments } from '../data/documents.mock'
import {
  IconChevronRight,
  IconBox,
  IconSliders,
  IconTruck,
  IconBuilding,
  IconDoc,
  IconArrowRight,
  IconCart,
} from '../components/ui/icons'

export function ProductDetailPage() {
  const { id } = useParams()
  const { products } = useAppState()
  const product = products.find((p) => p.id === id)
  const [tab, setTab] = useState('tech')

  if (!product) {
    return (
      <Card className="flex flex-col items-center gap-3 px-6 py-16 text-center">
        <h2 className="text-heading-md font-display text-content">Producto no encontrado</h2>
        <p className="text-body-md text-content-muted">El SKU solicitado no existe en el catálogo.</p>
        <Link to="/productos">
          <Button variant="outline">Volver a productos</Button>
        </Link>
      </Card>
    )
  }

  const tabs: TabItem[] = [
    { id: 'tech', label: 'Información técnica', icon: <IconBox size={18} /> },
    { id: 'commercial', label: 'Comercial', icon: <IconSliders size={18} /> },
    { id: 'logistics', label: 'Logística', icon: <IconTruck size={18} /> },
    {
      id: 'docs',
      label: 'Documentación',
      icon: <IconDoc size={18} />,
      count: getDocuments(product).length,
    },
    {
      id: 'suppliers',
      label: 'Proveedores',
      icon: <IconBuilding size={18} />,
      count: product.supplierIds.length,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-caption text-content-muted">
        <Link to="/productos" className="hover:text-content">
          Productos
        </Link>
        <IconChevronRight size={14} />
        <span className="text-content">{product.code}</span>
      </nav>

      {/* Header */}
      <Card className="p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex gap-4">
            <span className="hidden h-12 w-12 shrink-0 place-items-center rounded-lg bg-violet/10 font-display text-[22px] text-violet sm:grid">
              ▤
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-code text-content-muted">{product.code}</span>
                <ProductStatusBadge status={product.status} />
                <SourcingBadge sourcing={product.sourcing} />
              </div>
              <h1 className="mt-1 font-display text-heading-lg text-content">{product.name}</h1>
              <div className="mt-2.5 flex flex-wrap gap-2">
                <Badge tone="neutral">{product.category}</Badge>
                <Badge tone="neutral">{product.subcategory}</Badge>
                <Badge tone="neutral">{product.family}</Badge>
              </div>
              <p className="mt-2 text-caption text-content-faint">
                Última actualización · {formatDate(product.updatedAt)}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-start gap-3 lg:items-end">
            <div className="lg:text-right">
              <div className="text-micro-cap uppercase text-content-faint">Precio base</div>
              <div className="font-display text-heading-xl text-content tabular-nums">
                {formatCLP(product.basePrice)}
                <span className="text-body-md font-sans font-normal text-content-faint"> /{product.unit}</span>
              </div>
            </div>
            <div className="flex gap-2.5">
              <Link to={`/precios?product=${product.id}`}>
                <Button variant="outline" size="sm">
                  <IconSliders size={16} /> Precios
                </Button>
              </Link>
              <Link to={`/pedidos/nuevo?product=${product.id}`}>
                <Button size="sm">
                  <IconCart size={16} /> Solicitar <IconArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs + panels */}
      <div>
        <Tabs tabs={tabs} value={tab} onChange={setTab} />
        <div className="pt-5">
          {tab === 'tech' && <TechSpecs tech={product.tech} />}
          {tab === 'commercial' && <CommercialPanel product={product} />}
          {tab === 'logistics' && <LogisticsPanel product={product} />}
          {tab === 'docs' && <DocumentationPanel product={product} />}
          {tab === 'suppliers' && <SuppliersPanel supplierIds={product.supplierIds} />}
        </div>
      </div>
    </div>
  )
}

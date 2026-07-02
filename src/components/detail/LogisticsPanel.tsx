import type { Product } from '../../data/types'
import { formatNumber } from '../../lib/format'
import { Card, SectionTitle } from '../ui/Card'
import { PalletContainerViz } from './PalletContainerViz'
import { IconTruck, IconBox } from '../ui/icons'

export function LogisticsPanel({ product }: { product: Product }) {
  const { logistics, unit } = product
  return (
    <div className="grid gap-4 lg:grid-cols-5">
      <Card className="p-5 lg:col-span-2">
        <SectionTitle eyebrow="Paletizado" title="Datos logísticos" icon={<IconBox size={13} />} />
        <dl className="mt-4 space-y-3">
          <Fact label="Unidad comercial" value={unit} />
          <Fact label="Unidades por pallet" value={formatNumber(logistics.unitsPerPallet)} />
          <Fact label="Peso por pallet" value={`${formatNumber(logistics.palletWeightKg)} kg`} />
          <Fact
            label="Contenedor óptimo"
            value={
              logistics.palletsPerContainer.reduce((a, b) => (b.pallets > a.pallets ? b : a)).container
            }
          />
        </dl>
      </Card>

      <Card className="p-5 lg:col-span-3">
        <SectionTitle
          eyebrow="Capacidad de carga"
          title="Pallets por tipo de contenedor"
          icon={<IconTruck size={13} />}
        />
        <div className="mt-4">
          <PalletContainerViz logistics={logistics} unit={unit} />
        </div>
      </Card>
    </div>
  )
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-hairline pb-3 last:border-0 last:pb-0">
      <dt className="text-body-md text-content-muted">{label}</dt>
      <dd className="text-body-md font-medium text-content">{value}</dd>
    </div>
  )
}

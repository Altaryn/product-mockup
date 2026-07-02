import { useState } from 'react'
import type { ContainerType, Logistics } from '../../data/types'
import { formatNumber } from '../../lib/format'
import { Segmented } from '../ui/Segmented'

/**
 * NEW COMPONENT (not in DESIGN-sentry.md) — pallet-per-container viz.
 * Built from existing tokens: violet pallet blocks on a hairline "container"
 * body with a corrugated texture. Selector switches container type.
 */
export function PalletContainerViz({
  logistics,
  unit,
}: {
  logistics: Logistics
  unit: string
}) {
  const options = logistics.palletsPerContainer
  const [selected, setSelected] = useState<ContainerType>(
    options[options.length - 1]?.container ?? options[0].container,
  )
  const current = options.find((o) => o.container === selected) ?? options[0]
  const pallets = current.pallets
  const totalUnits = pallets * logistics.unitsPerPallet
  const totalWeight = pallets * logistics.palletWeightKg

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Segmented<ContainerType>
          size="sm"
          value={selected}
          onChange={setSelected}
          options={options.map((o) => ({ value: o.container, label: o.container.replace('Contenedor ', '') }))}
        />
        <div className="text-caption text-content-muted">
          {formatNumber(logistics.unitsPerPallet)} u./pallet · {formatNumber(logistics.palletWeightKg)} kg/pallet
        </div>
      </div>

      {/* Container graphic */}
      <div className="relative overflow-hidden rounded-lg border-2 border-hairline-strong bg-surface-2">
        {/* corrugated texture */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, transparent 0 9px, rgb(var(--hairline)) 9px 10px)',
          }}
        />
        {/* door seam on the right */}
        <div className="absolute right-8 top-0 bottom-0 w-px bg-hairline-strong opacity-60" />

        <div className="relative flex min-h-[132px] flex-wrap content-end items-end gap-1.5 p-3">
          {Array.from({ length: pallets }).map((_, i) => (
            <div
              key={i}
              className="h-9 w-5 rounded-[3px] border border-violet/40 bg-violet/25"
              title={`Pallet ${i + 1}`}
            />
          ))}
        </div>

        {/* count chip */}
        <div className="absolute right-2.5 top-2.5 rounded-xs bg-night px-2 py-0.5 text-micro-cap uppercase text-on-primary">
          {pallets} pallets
        </div>
      </div>

      {/* Readout */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        <Stat label="Pallets" value={formatNumber(pallets)} />
        <Stat label={`Total (${unit})`} value={formatNumber(totalUnits)} />
        <Stat label="Peso total" value={`${formatNumber(totalWeight)} kg`} />
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-hairline bg-surface p-3 text-center">
      <div className="text-micro-cap uppercase text-content-faint">{label}</div>
      <div className="mt-0.5 font-display text-heading-sm text-content tabular-nums">{value}</div>
    </div>
  )
}

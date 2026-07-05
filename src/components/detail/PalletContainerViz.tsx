import { useState } from 'react'
import type { ContainerType, Logistics } from '../../data/types'
import { formatNumber } from '../../lib/format'
import { cn } from '../../lib/cn'
import { Segmented } from '../ui/Segmented'

type ViewKey = ContainerType | 'compare'

interface ContainerOption {
  container: ContainerType
  pallets: number
}

/**
 * Visualización de pallets por contenedor con dos modos:
 *  - Contenedor: gráfico del contenedor con bloques de pallet + totales.
 *  - Comparar: barras proporcionales para comparar los 3 tipos de un vistazo.
 * Construido con tokens existentes (bloques violeta sobre cuerpo hairline).
 */
export function PalletContainerViz({ logistics, unit }: { logistics: Logistics; unit: string }) {
  const options = logistics.palletsPerContainer
  const maxPallets = Math.max(...options.map((o) => o.pallets))
  const optimal = options.reduce((a, b) => (b.pallets > a.pallets ? b : a)).container
  const [view, setView] = useState<ViewKey>(optimal)

  const segOptions = [
    ...options.map((o) => ({
      value: o.container as ViewKey,
      label: o.container.replace('Contenedor ', ''),
    })),
    { value: 'compare' as ViewKey, label: 'Comparar' },
  ]

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Segmented<ViewKey> size="sm" value={view} onChange={setView} options={segOptions} />
        <div className="text-caption text-content-muted">
          {formatNumber(logistics.unitsPerPallet)} u./pallet · {formatNumber(logistics.palletWeightKg)}{' '}
          kg/pallet
        </div>
      </div>

      {view === 'compare' ? (
        <CompareView
          options={options}
          maxPallets={maxPallets}
          optimal={optimal}
          unit={unit}
          unitsPerPallet={logistics.unitsPerPallet}
        />
      ) : (
        <ContainerView
          current={options.find((o) => o.container === view) ?? options[0]}
          logistics={logistics}
          unit={unit}
        />
      )}
    </div>
  )
}

/** Modo Contenedor: cuerpo del contenedor con un bloque por pallet + totales. */
function ContainerView({
  current,
  logistics,
  unit,
}: {
  current: ContainerOption
  logistics: Logistics
  unit: string
}) {
  const { pallets } = current
  const totalUnits = pallets * logistics.unitsPerPallet
  const totalWeight = pallets * logistics.palletWeightKg

  return (
    <>
      <div className="relative overflow-hidden rounded-lg border-2 border-hairline-strong bg-surface-2">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, transparent 0 9px, rgb(var(--hairline)) 9px 10px)',
          }}
        />
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

        <div className="absolute right-2.5 top-2.5 rounded-xs bg-night px-2 py-0.5 text-micro-cap uppercase text-on-primary">
          {pallets} pallets
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <Stat label="Pallets" value={formatNumber(pallets)} />
        <Stat label={`Total (${unit})`} value={formatNumber(totalUnits)} />
        <Stat label="Peso total" value={`${formatNumber(totalWeight)} kg`} />
      </div>
    </>
  )
}

/** Modo Comparar: barras proporcionales de pallets por tipo de contenedor. */
function CompareView({
  options,
  maxPallets,
  optimal,
  unit,
  unitsPerPallet,
}: {
  options: ContainerOption[]
  maxPallets: number
  optimal: ContainerType
  unit: string
  unitsPerPallet: number
}) {
  return (
    <div className="rounded-lg border border-hairline bg-surface-2 p-4">
      <div className="space-y-3">
        {options.map((o) => {
          const pct = maxPallets ? (o.pallets / maxPallets) * 100 : 0
          const isOptimal = o.container === optimal
          return (
            <div key={o.container} className="flex items-center gap-3">
              <div className="flex w-14 shrink-0 items-center gap-1.5 text-caption font-medium text-content sm:w-20">
                {o.container.replace('Contenedor ', '')}
              </div>
              <div className="relative h-8 flex-1 overflow-hidden rounded-md bg-surface-3">
                <div
                  className={cn('h-full rounded-md', isOptimal ? 'bg-violet' : 'bg-violet/40')}
                  style={{
                    width: `${Math.max(pct, 6)}%`,
                    backgroundImage:
                      'repeating-linear-gradient(90deg, rgba(255,255,255,0) 0 12px, rgba(255,255,255,0.30) 12px 13px)',
                  }}
                />
                {isOptimal && (
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-micro-cap uppercase text-on-primary">
                    óptimo
                  </span>
                )}
              </div>
              <div className="w-16 shrink-0 text-right text-caption text-content tabular-nums sm:w-20">
                <span className="font-semibold">{formatNumber(o.pallets)}</span>{' '}
                <span className="text-content-muted">pallets</span>
              </div>
              <div className="hidden w-24 shrink-0 text-right text-caption text-content-muted tabular-nums sm:block">
                {formatNumber(o.pallets * unitsPerPallet)} {unit}
              </div>
            </div>
          )
        })}
      </div>
      <p className="mt-3 border-t border-hairline pt-3 text-caption text-content-faint">
        Capacidad = pallets × {formatNumber(unitsPerPallet)} {unit}/pallet. La barra llena marca el
        contenedor con mejor aprovechamiento.
      </p>
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

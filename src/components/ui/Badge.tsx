import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import type { ProductStatus, SourcingType } from '../../data/types'

type Tone = 'neutral' | 'violet' | 'pink' | 'lime' | 'muted'

const tones: Record<Tone, string> = {
  neutral: 'bg-surface-3 text-content border-transparent',
  violet: 'bg-violet/12 text-violet border-violet/25',
  pink: 'bg-pink/15 text-pink border-pink/30',
  lime: 'bg-lime/25 text-ink border-lime/50',
  muted: 'bg-transparent text-content-muted border-hairline-strong',
}

export function Badge({
  tone = 'neutral',
  children,
  dot = false,
  className,
}: {
  tone?: Tone
  children: ReactNode
  dot?: boolean
  className?: string
}) {
  const dotColor: Record<Tone, string> = {
    neutral: 'bg-content-faint',
    violet: 'bg-violet',
    pink: 'bg-pink',
    lime: 'bg-lime',
    muted: 'bg-content-faint',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-xs border px-2 py-0.5 text-caption font-medium whitespace-nowrap',
        tones[tone],
        className,
      )}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', dotColor[tone])} />}
      {children}
    </span>
  )
}

// Status colors kept inside the palette (violet / pink / neutral) — lime stays scarce.
const productStatusTone: Record<ProductStatus, Tone> = {
  activo: 'violet',
  borrador: 'muted',
  descontinuado: 'pink',
}
const productStatusLabel: Record<ProductStatus, string> = {
  activo: 'Activo',
  borrador: 'Borrador',
  descontinuado: 'Descontinuado',
}

export function ProductStatusBadge({ status }: { status: ProductStatus }) {
  return (
    <Badge tone={productStatusTone[status]} dot>
      {productStatusLabel[status]}
    </Badge>
  )
}

// Origen comercial — diferencia fabricación propia / compra / reventa.
const sourcingTone: Record<SourcingType, Tone> = {
  fabricacion: 'violet',
  compra: 'neutral',
  reventa: 'pink',
}
const sourcingLabel: Record<SourcingType, string> = {
  fabricacion: 'Fabricación propia',
  compra: 'Compra',
  reventa: 'Reventa',
}

export function SourcingBadge({ sourcing, short = false }: { sourcing: SourcingType; short?: boolean }) {
  const label = short && sourcing === 'fabricacion' ? 'Fabricación' : sourcingLabel[sourcing]
  return <Badge tone={sourcingTone[sourcing]}>{label}</Badge>
}

const userStatusTone: Record<string, Tone> = {
  activo: 'violet',
  invitado: 'neutral',
  inactivo: 'muted',
}
export function UserStatusBadge({ status }: { status: 'activo' | 'invitado' | 'inactivo' }) {
  const label = { activo: 'Activo', invitado: 'Invitado', inactivo: 'Inactivo' }[status]
  return (
    <Badge tone={userStatusTone[status]} dot>
      {label}
    </Badge>
  )
}

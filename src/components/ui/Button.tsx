import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

type Variant = 'primary' | 'inverted' | 'outline' | 'ghost' | 'token' | 'danger'
type Size = 'sm' | 'md'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  children: ReactNode
}

// button-cap cadence (uppercase, 0.2px tracking) per DESIGN — the brand signature.
const base =
  'inline-flex items-center justify-center gap-2 font-sans font-bold uppercase tracking-[0.2px] rounded-md ' +
  'transition-colors select-none disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap'

const sizes: Record<Size, string> = {
  sm: 'text-[13px] px-3 py-1.5 min-h-[36px]',
  md: 'text-button-cap px-4 py-3 min-h-[44px]', // 44px WCAG touch target
}

const variants: Record<Variant, string> = {
  // Polarity-flipping primary: dark on light canvas, white on dark canvas (CSS var).
  primary: 'bg-btn-primary text-btn-primary-fg hover:opacity-90 active:opacity-100',
  inverted: 'bg-on-primary text-ink-deep hover:bg-press-light active:bg-press-strong',
  outline: 'border border-hairline-strong text-content bg-transparent hover:bg-surface-3',
  ghost: 'text-content hover:bg-surface-3',
  token:
    'bg-violet-mid text-on-primary normal-case tracking-normal font-medium border border-violet-deep/40 hover:bg-violet',
  danger: 'border border-pink text-pink bg-transparent hover:bg-pink/10',
}

export function Button({ variant = 'primary', size = 'md', className, children, ...rest }: Props) {
  return (
    <button className={cn(base, sizes[size], variants[variant], className)} {...rest}>
      {children}
    </button>
  )
}

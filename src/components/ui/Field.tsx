import type { InputHTMLAttributes, SelectHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

const fieldBase =
  'w-full rounded-sm border border-hairline-strong bg-surface text-content text-body-md ' +
  'px-3 py-2 min-h-[42px] placeholder:text-content-faint ' +
  'focus:outline-none focus:ring-2 focus:ring-ring-focus focus:border-transparent transition'

export function Label({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="block text-caption font-medium text-content-muted mb-1.5">
      {children}
    </label>
  )
}

export function Field({
  label,
  children,
  hint,
  className,
}: {
  label?: string
  children: ReactNode
  hint?: string
  className?: string
}) {
  return (
    <div className={className}>
      {label && <Label>{label}</Label>}
      {children}
      {hint && <p className="mt-1 text-caption text-content-faint">{hint}</p>}
    </div>
  )
}

export function Input({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldBase, className)} {...rest} />
}

export function Select({ className, children, ...rest }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(fieldBase, 'appearance-none pr-9 cursor-pointer', className)} {...rest}>
      {children}
    </select>
  )
}

/** Select with the chevron affordance baked in. */
export function SelectField({
  label,
  hint,
  className,
  children,
  ...rest
}: SelectHTMLAttributes<HTMLSelectElement> & { label?: string; hint?: string }) {
  return (
    <Field label={label} hint={hint} className={className}>
      <div className="relative">
        <Select {...rest}>{children}</Select>
        <svg
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-content-muted"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </Field>
  )
}

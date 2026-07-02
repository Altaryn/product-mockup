const clp = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0,
})

const num = new Intl.NumberFormat('es-CL')

export const formatCLP = (value: number) => clp.format(value)
export const formatNumber = (value: number) => num.format(value)
export const formatPct = (value: number) => `${value}%`

/** "801" → "801+"; range → "201 – 400" for volume-tier display. */
export function formatRange(min: number, max: number | null): string {
  return max === null ? `${num.format(min)}+` : `${num.format(min)} – ${num.format(max)}`
}

export function formatDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' })
}

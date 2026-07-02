import { useEffect, type ReactNode } from 'react'
import { IconClose } from './icons'

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = 'md',
}: {
  open: boolean
  onClose: () => void
  title: ReactNode
  children: ReactNode
  footer?: ReactNode
  size?: 'md' | 'lg'
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-ink-deep/60 backdrop-blur-sm" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className={`relative z-10 w-full ${
          size === 'lg' ? 'sm:max-w-3xl' : 'sm:max-w-lg'
        } max-h-[92vh] overflow-hidden rounded-t-xxl sm:rounded-xl border border-hairline bg-surface shadow-e2 flex flex-col`}
      >
        <div className="flex items-center justify-between gap-4 border-b border-hairline px-5 py-4">
          <h3 className="text-heading-sm font-display text-content">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="rounded-md p-1.5 text-content-muted hover:bg-surface-3 hover:text-content"
          >
            <IconClose size={20} />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-5">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-3 border-t border-hairline px-5 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

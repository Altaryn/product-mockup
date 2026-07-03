import { useRef, useState } from 'react'
import type { DocumentType, Product, ProductDocument } from '../../data/types'
import { getDocuments } from '../../data/documents.mock'
import { formatDate } from '../../lib/format'
import { Card, SectionTitle } from '../ui/Card'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { IconDoc, IconDownload, IconUpload, IconInfo, IconTrash } from '../ui/icons'

const typeTone: Record<DocumentType, 'violet' | 'pink' | 'neutral'> = {
  'Ficha técnica': 'violet',
  'Ficha de seguridad': 'pink',
  Certificado: 'neutral',
  'Declaración de prestaciones': 'neutral',
  'Manual de instalación': 'neutral',
}

const formatFromName = (name: string): ProductDocument['format'] => {
  const ext = name.split('.').pop()?.toUpperCase()
  return ext === 'DOCX' || ext === 'DWG' ? ext : 'PDF'
}

const humanSize = (kb: number) => (kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`)

/**
 * Documentación técnica del producto (fichas, certificados, DoP…).
 * Mockup: la subida usa un <input type=file> real pero solo registra el
 * archivo en memoria local; no se persiste ni sube a ningún servidor.
 */
export function DocumentationPanel({ product }: { product: Product }) {
  const [docs, setDocs] = useState<ProductDocument[]>(() => getDocuments(product))
  const [uploadedIds, setUploadedIds] = useState<Set<string>>(new Set())
  const inputRef = useRef<HTMLInputElement>(null)

  const onFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return
    const today = new Date().toISOString().slice(0, 10)
    const added = Array.from(files).map((f, i) => ({
      id: `${product.id}-up-${docs.length + i}-${f.name}`,
      name: f.name,
      type: 'Ficha técnica' as DocumentType,
      format: formatFromName(f.name),
      sizeKB: Math.max(1, Math.round(f.size / 1024)),
      version: 'v1.0',
      updatedAt: today,
    }))
    setDocs((d) => [...added, ...d])
    setUploadedIds((s) => new Set([...s, ...added.map((a) => a.id)]))
    if (inputRef.current) inputRef.current.value = ''
  }

  const remove = (id: string) => setDocs((d) => d.filter((x) => x.id !== id))

  return (
    <Card className="p-5">
      <SectionTitle
        eyebrow="Repositorio documental"
        title="Documentación técnica"
        icon={<IconDoc size={13} />}
        action={
          <>
            <input
              ref={inputRef}
              type="file"
              multiple
              accept=".pdf,.docx,.dwg"
              className="hidden"
              onChange={(e) => onFiles(e.target.files)}
            />
            <Button size="sm" onClick={() => inputRef.current?.click()}>
              <IconUpload size={16} /> Subir documento
            </Button>
          </>
        }
      />

      <div className="mt-4 flex items-start gap-2.5 rounded-md bg-violet/8 p-3 text-caption text-content-muted">
        <IconInfo size={16} className="mt-0.5 shrink-0 text-violet" />
        <p>
          Fichas técnicas, certificados, declaraciones de prestaciones y manuales del producto. Arrastra
          o usa <span className="font-medium text-content">Subir documento</span> para adjuntar (PDF, DOCX,
          DWG). Mockup: los archivos quedan en memoria local.
        </p>
      </div>

      {/* Header (desktop) */}
      <div className="mt-4 hidden grid-cols-[1fr_160px_90px_110px_40px] gap-3 px-3 pb-1 text-micro-cap uppercase text-content-muted sm:grid">
        <span>Documento</span>
        <span>Tipo</span>
        <span className="text-right">Tamaño</span>
        <span className="text-right">Actualizado</span>
        <span />
      </div>

      <ul className="divide-y divide-hairline overflow-hidden rounded-lg border border-hairline">
        {docs.map((doc) => (
          <li
            key={doc.id}
            className="grid grid-cols-1 gap-2 px-3 py-3 sm:grid-cols-[1fr_160px_90px_110px_40px] sm:items-center sm:gap-3"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-10 w-9 shrink-0 place-items-center rounded-md bg-surface-3 text-content-muted">
                <IconDoc size={20} />
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="truncate text-body-md font-medium text-content">{doc.name}</span>
                  {uploadedIds.has(doc.id) && <Badge tone="violet">Nuevo</Badge>}
                </div>
                <div className="flex items-center gap-2 text-caption text-content-faint">
                  <span className="font-mono">{doc.format}</span>
                  <span>·</span>
                  <span>{doc.version}</span>
                </div>
              </div>
            </div>

            <div className="sm:justify-self-start">
              <Badge tone={typeTone[doc.type]}>{doc.type}</Badge>
            </div>
            <div className="text-caption text-content-muted sm:text-right">{humanSize(doc.sizeKB)}</div>
            <div className="text-caption text-content-muted sm:text-right">{formatDate(doc.updatedAt)}</div>

            <div className="flex items-center justify-end gap-1">
              <button
                aria-label={`Descargar ${doc.name}`}
                title="Descargar (mock)"
                className="grid h-8 w-8 place-items-center rounded-md text-content-muted hover:bg-surface-3 hover:text-content"
              >
                <IconDownload size={18} />
              </button>
              <button
                onClick={() => remove(doc.id)}
                aria-label={`Eliminar ${doc.name}`}
                title="Eliminar"
                className="grid h-8 w-8 place-items-center rounded-md text-content-muted hover:text-pink"
              >
                <IconTrash size={18} />
              </button>
            </div>
          </li>
        ))}
        {docs.length === 0 && (
          <li className="px-3 py-8 text-center text-body-md text-content-muted">
            Sin documentos. Sube la primera ficha técnica del producto.
          </li>
        )}
      </ul>
    </Card>
  )
}

import type { DocumentType, Product, ProductDocument } from './types'

/**
 * Mock del repositorio documental. En producción los documentos vendrían de un
 * gestor de archivos (DMS); aquí se derivan por categoría para poblar la ficha.
 */
const byCategory: Record<string, DocumentType[]> = {
  'Placas de yeso': ['Ficha técnica', 'Declaración de prestaciones', 'Certificado', 'Manual de instalación'],
  Perfilería: ['Ficha técnica', 'Certificado'],
  Aislación: ['Ficha técnica', 'Declaración de prestaciones', 'Certificado'],
  'Pastas y compuestos': ['Ficha técnica', 'Ficha de seguridad'],
  Cielos: ['Ficha técnica', 'Declaración de prestaciones', 'Manual de instalación'],
  Fijaciones: ['Ficha técnica', 'Certificado'],
}

const meta: Record<DocumentType, { suffix: string; format: ProductDocument['format']; sizeKB: number }> = {
  'Ficha técnica': { suffix: 'Ficha técnica', format: 'PDF', sizeKB: 680 },
  Certificado: { suffix: 'Certificado', format: 'PDF', sizeKB: 420 },
  'Declaración de prestaciones': { suffix: 'DoP', format: 'PDF', sizeKB: 310 },
  'Ficha de seguridad': { suffix: 'FDS', format: 'PDF', sizeKB: 540 },
  'Manual de instalación': { suffix: 'Manual de instalación', format: 'PDF', sizeKB: 1240 },
}

export function getDocuments(product: Product): ProductDocument[] {
  const types = byCategory[product.category] ?? ['Ficha técnica']
  return types.map((type, i) => {
    const m = meta[type]
    return {
      id: `${product.id}-doc-${i}`,
      name: `${product.code} · ${m.suffix}.${m.format.toLowerCase()}`,
      type,
      format: m.format,
      sizeKB: m.sizeKB,
      version: `v${1 + (i % 2)}.${(i * 3) % 10}`,
      updatedAt: product.updatedAt,
    }
  })
}

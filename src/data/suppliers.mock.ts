import type { Supplier } from './types'

/**
 * ⚠️ DATA REFERENCIADA — MÓDULO "SUPPLIER MASTER" (aún no existe).
 *
 * Estos registros son un mock del módulo Supplier Master. En producción NO se
 * almacenan aquí: la ficha de producto los resolvería vía API por `supplierIds`,
 * p. ej. `await supplierMaster.getMany(product.supplierIds)`.
 * Punto de integración único: reemplazar `suppliers` / `supplierById` por esa llamada.
 */
export const suppliers: Supplier[] = [
  {
    id: 'SUP-01',
    name: 'Knauf Chile — Planta San Bernardo',
    type: 'interno',
    category: 'Placas de yeso',
    subcategory: 'Fabricación nacional',
    country: 'Chile',
    leadTimeDays: 4,
  },
  {
    id: 'SUP-02',
    name: 'Knauf Insulation — Planta Zárate',
    type: 'interno',
    category: 'Aislación',
    subcategory: 'Lana mineral',
    country: 'Argentina',
    leadTimeDays: 12,
  },
  {
    id: 'SUP-03',
    name: 'Knauf Gips KG — Iphofen',
    type: 'interno',
    category: 'Placas especiales',
    subcategory: 'Importación intercompañía',
    country: 'Alemania',
    leadTimeDays: 45,
  },
  {
    id: 'SUP-04',
    name: 'Perfiles Andinos S.A.',
    type: 'externo',
    category: 'Perfilería',
    subcategory: 'Acero galvanizado',
    country: 'Chile',
    leadTimeDays: 7,
  },
  {
    id: 'SUP-05',
    name: 'CAP Acero',
    type: 'externo',
    category: 'Materia prima',
    subcategory: 'Bobina galvanizada',
    country: 'Chile',
    leadTimeDays: 10,
  },
  {
    id: 'SUP-06',
    name: 'Compuestos y Pastas Ltda.',
    type: 'externo',
    category: 'Pastas y compuestos',
    subcategory: 'Juntas',
    country: 'Chile',
    leadTimeDays: 5,
  },
]

export const supplierById = (id: string): Supplier | undefined =>
  suppliers.find((s) => s.id === id)

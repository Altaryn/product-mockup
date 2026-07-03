// Domain model for Product Master. Mockup only — no backend.

export type ProductStatus = 'activo' | 'borrador' | 'descontinuado'

/** Origen comercial del producto en la red Knauf. */
export type SourcingType = 'fabricacion' | 'compra' | 'reventa'

export type DocumentType =
  | 'Ficha técnica'
  | 'Certificado'
  | 'Declaración de prestaciones'
  | 'Ficha de seguridad'
  | 'Manual de instalación'

/** Documento técnico adjunto a un producto (ficha, certificado, etc.). */
export interface ProductDocument {
  id: string
  name: string
  type: DocumentType
  format: 'PDF' | 'DOCX' | 'DWG'
  sizeKB: number
  version: string
  updatedAt: string // ISO date
}

/** A single technical attribute. `group` lets the UI cluster specs by section. */
export interface TechAttribute {
  label: string
  value: string
  unit?: string
  group: 'Dimensiones' | 'Prestaciones' | 'Material' | 'Normativa'
}

/** Volume discount tier: quantity range (in the product's unit) → % discount. */
export interface VolumeTier {
  min: number
  max: number | null // null = "y superior"
  discountPct: number
}

/** Discount applied when buying across a family/system of products. */
export interface FamilyDiscount {
  family: string
  discountPct: number
  note?: string
}

/** Price for a specific client's price list (overrides base price). */
export interface PriceListEntry {
  clientId: string
  price: number
}

export interface Logistics {
  unitsPerPallet: number
  palletWeightKg: number
  /** Pallets that fit per container type — drives the pallet/container viz. */
  palletsPerContainer: { container: ContainerType; pallets: number }[]
}

export type ContainerType = "Contenedor 20'" | "Contenedor 40'" | "Contenedor 40' HC"

export interface Product {
  id: string
  code: string
  name: string
  category: string
  subcategory: string
  family: string
  status: ProductStatus
  /** Fabricación propia / compra a externo / reventa entre sedes. */
  sourcing: SourcingType
  /** Commercial unit, e.g. "m²", "un", "rollo", "saco". */
  unit: string
  basePrice: number
  currency: 'CLP'
  updatedAt: string // ISO date
  tech: TechAttribute[]
  commercial: {
    priceLists: PriceListEntry[]
    volumeTiers: VolumeTier[]
    familyDiscounts: FamilyDiscount[]
  }
  logistics: Logistics
  /** IDs referencing the (future) Supplier Master module. */
  supplierIds: string[]
}

export interface Client {
  id: string
  name: string
  segment: string
  priceListName: string
}

/**
 * Supplier — mock stand-in for records owned by the future "Supplier Master"
 * module. In production this is fetched from that module, not stored here.
 */
export interface Supplier {
  id: string
  name: string
  type: 'interno' | 'externo'
  category: string
  subcategory: string
  country: string
  leadTimeDays: number
}

export type PermissionArea = 'Productos' | 'Precios' | 'Pedidos' | 'Proveedores' | 'Usuarios'
export type PermissionLevel = 'sin-acceso' | 'lectura' | 'edicion' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  role: string
  status: 'activo' | 'invitado' | 'inactivo'
  permissions: Record<PermissionArea, PermissionLevel>
}

export type OrderStatus = 'pendiente' | 'aprobada' | 'enviada' | 'entregada' | 'rechazada'

/** Línea de una solicitud: producto + cantidad. Los montos se derivan al vuelo. */
export interface OrderLine {
  productId: string
  qty: number
}

/**
 * Solicitud de pedido registrada (historial). `lines` es la fuente de verdad;
 * ítems y total se calculan con la lista del cliente (ver lib/orders).
 */
export interface Order {
  id: string // p. ej. "SP-2026-0142"
  userId: string // quién la generó
  clientId: string
  date: string // ISO
  status: OrderStatus
  lines: OrderLine[]
}

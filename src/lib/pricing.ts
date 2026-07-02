import type { Product, VolumeTier } from '../data/types'

export interface PriceResult {
  /** List/base price before volume discount (client list if any, else base). */
  listPrice: number
  /** Whether a client-specific price list applied. */
  fromClientList: boolean
  tier: VolumeTier | null
  discountPct: number
  /** Final unit price after applying the matching volume tier. */
  unitPrice: number
  lineTotal: number
}

export function findTier(product: Product, quantity: number): VolumeTier | null {
  return (
    product.commercial.volumeTiers.find(
      (t) => quantity >= t.min && (t.max === null || quantity <= t.max),
    ) ?? null
  )
}

/**
 * Resolve the vigent unit price for a product given a client and quantity.
 * Order: client price list (if present) → base price, then apply the volume
 * tier discount for the requested quantity. Mockup-level logic only.
 */
export function resolvePrice(product: Product, clientId: string, quantity: number): PriceResult {
  const entry = product.commercial.priceLists.find((p) => p.clientId === clientId)
  const listPrice = entry ? entry.price : product.basePrice
  const tier = quantity > 0 ? findTier(product, quantity) : null
  const discountPct = tier ? tier.discountPct : 0
  const unitPrice = Math.round(listPrice * (1 - discountPct / 100))
  return {
    listPrice,
    fromClientList: Boolean(entry),
    tier,
    discountPct,
    unitPrice,
    lineTotal: unitPrice * Math.max(0, quantity),
  }
}

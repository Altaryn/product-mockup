import type { Order, Product } from '../data/types'
import { productById } from '../data/products.mock'
import { resolvePrice } from './pricing'

export interface PricedOrderLine {
  productId: string
  product: Product
  qty: number
  unitPrice: number
  discountPct: number
  fromClientList: boolean
  subtotal: number
}

export interface PricedOrder {
  lines: PricedOrderLine[]
  itemsCount: number
  total: number
  totalPallets: number
  totalWeightKg: number
}

/** Resuelve montos y logística de una orden desde sus líneas (fuente de verdad). */
export function priceOrder(order: Order): PricedOrder {
  const lines: PricedOrderLine[] = order.lines.flatMap((l) => {
    const product = productById(l.productId)
    if (!product) return []
    const p = resolvePrice(product, order.clientId, l.qty)
    return [
      {
        productId: l.productId,
        product,
        qty: l.qty,
        unitPrice: p.unitPrice,
        discountPct: p.discountPct,
        fromClientList: p.fromClientList,
        subtotal: p.lineTotal,
      },
    ]
  })

  const total = lines.reduce((s, l) => s + l.subtotal, 0)
  const totalPallets = lines.reduce((s, l) => s + l.qty / l.product.logistics.unitsPerPallet, 0)
  const totalWeightKg = lines.reduce(
    (s, l) => s + (l.qty / l.product.logistics.unitsPerPallet) * l.product.logistics.palletWeightKg,
    0,
  )

  return { lines, itemsCount: lines.length, total, totalPallets, totalWeightKg }
}

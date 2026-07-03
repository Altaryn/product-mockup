import type { Order, OrderStatus } from './types'

/**
 * Historial de solicitudes de pedido (mock). Referencia usuarios (users.mock)
 * y clientes (clients.mock). Los pedidos nuevos creados en la app se anteponen
 * en memoria vía el store; esto es solo la semilla de respaldo.
 */
export const orders: Order[] = [
  {
    id: 'SP-2026-0151',
    userId: 'u-002',
    clientId: 'CL-101',
    date: '2026-07-01',
    status: 'pendiente',
    lines: [
      { productId: 'p-pyc-std-125', qty: 300 },
      { productId: 'p-mont-70', qty: 200 },
      { productId: 'p-pasta-junta-20', qty: 12 },
    ],
  },
  {
    id: 'SP-2026-0150',
    userId: 'u-003',
    clientId: 'CL-102',
    date: '2026-06-28',
    status: 'aprobada',
    lines: [
      { productId: 'p-pyc-rf-150', qty: 400 },
      { productId: 'p-mont-70', qty: 300 },
      { productId: 'p-canal-70', qty: 150 },
      { productId: 'p-pasta-junta-20', qty: 20 },
      { productId: 'p-cinta-papel-75', qty: 40 },
    ],
  },
  {
    id: 'SP-2026-0149',
    userId: 'u-002',
    clientId: 'CL-104',
    date: '2026-06-27',
    status: 'enviada',
    lines: [
      { productId: 'p-lv-roll-50', qty: 250 },
      { productId: 'p-lr-panel-50', qty: 120 },
    ],
  },
  {
    id: 'SP-2026-0148',
    userId: 'u-001',
    clientId: 'CL-101',
    date: '2026-06-25',
    status: 'entregada',
    lines: [
      { productId: 'p-pyc-std-125', qty: 500 },
      { productId: 'p-pyc-rh-125', qty: 200 },
      { productId: 'p-mont-70', qty: 400 },
      { productId: 'p-canal-70', qty: 200 },
      { productId: 'p-pasta-junta-20', qty: 30 },
      { productId: 'p-torn-25', qty: 40 },
    ],
  },
  {
    id: 'SP-2026-0147',
    userId: 'u-003',
    clientId: 'CL-103',
    date: '2026-06-22',
    status: 'entregada',
    lines: [
      { productId: 'p-cielo-mod-60', qty: 300 },
      { productId: 'p-mont-48', qty: 250 },
      { productId: 'p-pasta-junta-20', qty: 15 },
      { productId: 'p-cinta-papel-75', qty: 30 },
    ],
  },
  {
    id: 'SP-2026-0146',
    userId: 'u-002',
    clientId: 'CL-101',
    date: '2026-06-20',
    status: 'entregada',
    lines: [{ productId: 'p-pyc-std-125', qty: 150 }],
  },
  {
    id: 'SP-2026-0145',
    userId: 'u-002',
    clientId: 'CL-104',
    date: '2026-06-18',
    status: 'rechazada',
    lines: [
      { productId: 'p-pyc-ad-125', qty: 120 },
      { productId: 'p-mont-70', qty: 200 },
      { productId: 'p-pasta-junta-20', qty: 10 },
    ],
  },
  {
    id: 'SP-2026-0144',
    userId: 'u-003',
    clientId: 'CL-102',
    date: '2026-06-15',
    status: 'entregada',
    lines: [
      { productId: 'p-pyc-std-125', qty: 800 },
      { productId: 'p-pyc-rf-150', qty: 300 },
      { productId: 'p-mont-70', qty: 600 },
      { productId: 'p-canal-70', qty: 300 },
      { productId: 'p-mont-48', qty: 200 },
      { productId: 'p-pasta-junta-20', qty: 40 },
      { productId: 'p-cinta-papel-75', qty: 60 },
    ],
  },
  {
    id: 'SP-2026-0143',
    userId: 'u-001',
    clientId: 'CL-105',
    date: '2026-06-12',
    status: 'entregada',
    lines: [
      { productId: 'p-lv-roll-50', qty: 500 },
      { productId: 'p-pyc-std-125', qty: 200 },
    ],
  },
  {
    id: 'SP-2026-0142',
    userId: 'u-002',
    clientId: 'CL-101',
    date: '2026-06-08',
    status: 'entregada',
    lines: [
      { productId: 'p-pyc-rh-125', qty: 200 },
      { productId: 'p-mont-48', qty: 300 },
      { productId: 'p-pasta-junta-20', qty: 20 },
      { productId: 'p-cinta-papel-75', qty: 50 },
    ],
  },
  {
    id: 'SP-2026-0141',
    userId: 'u-003',
    clientId: 'CL-103',
    date: '2026-06-03',
    status: 'entregada',
    lines: [
      { productId: 'p-cielo-mod-60', qty: 250 },
      { productId: 'p-mont-70', qty: 400 },
      { productId: 'p-canal-70', qty: 200 },
      { productId: 'p-pasta-junta-20', qty: 25 },
      { productId: 'p-torn-25', qty: 30 },
    ],
  },
]

export const orderStatuses: OrderStatus[] = ['pendiente', 'aprobada', 'enviada', 'entregada', 'rechazada']

export const orderStatusLabel: Record<OrderStatus, string> = {
  pendiente: 'Pendiente',
  aprobada: 'Aprobada',
  enviada: 'Enviada',
  entregada: 'Entregada',
  rechazada: 'Rechazada',
}

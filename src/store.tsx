import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Order, Product, User } from './data/types'
import { users } from './data/users.mock'
import { orders as seedOrders } from './data/orders.mock'
import { products as seedProducts } from './data/products.mock'

/**
 * Estado de sesión del mockup: el "usuario activo" (perfil con el que se navega),
 * el catálogo de productos y el historial de pedidos, todo en memoria. Los seeds
 * vienen de los mocks; lo creado en la app se antepone. Sin backend ni persistencia.
 */
interface AppState {
  currentUser: User
  setCurrentUserId: (id: string) => void
  users: User[]
  orders: Order[]
  addOrder: (order: Order) => void
  products: Product[]
  addProduct: (product: Product) => void
}

const Ctx = createContext<AppState | null>(null)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [currentUserId, setCurrentUserId] = useState('u-001') // Carlos Alfaro (Administrador)
  const [orders, setOrders] = useState<Order[]>(seedOrders)
  const [products, setProducts] = useState<Product[]>(seedProducts)

  const currentUser = useMemo(
    () => users.find((u) => u.id === currentUserId) ?? users[0],
    [currentUserId],
  )
  const addOrder = (order: Order) => setOrders((o) => [order, ...o])
  const addProduct = (product: Product) => setProducts((p) => [product, ...p])

  return (
    <Ctx.Provider
      value={{ currentUser, setCurrentUserId, users, orders, addOrder, products, addProduct }}
    >
      {children}
    </Ctx.Provider>
  )
}

export function useAppState(): AppState {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider')
  return ctx
}

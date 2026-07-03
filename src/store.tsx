import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Order, User } from './data/types'
import { users } from './data/users.mock'
import { orders as seedOrders } from './data/orders.mock'

/**
 * Estado de sesión del mockup: el "usuario activo" (perfil con el que se navega)
 * y el historial de pedidos en memoria. Sin backend ni persistencia.
 */
interface AppState {
  currentUser: User
  setCurrentUserId: (id: string) => void
  users: User[]
  orders: Order[]
  addOrder: (order: Order) => void
}

const Ctx = createContext<AppState | null>(null)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [currentUserId, setCurrentUserId] = useState('u-001') // Carlos Alfaro (Administrador)
  const [orders, setOrders] = useState<Order[]>(seedOrders)

  const currentUser = useMemo(
    () => users.find((u) => u.id === currentUserId) ?? users[0],
    [currentUserId],
  )
  const addOrder = (order: Order) => setOrders((o) => [order, ...o])

  return (
    <Ctx.Provider value={{ currentUser, setCurrentUserId, users, orders, addOrder }}>
      {children}
    </Ctx.Provider>
  )
}

export function useAppState(): AppState {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider')
  return ctx
}

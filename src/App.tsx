import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { ProductsPage } from './pages/ProductsPage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { PricingPage } from './pages/PricingPage'
import { OrdersListPage } from './pages/OrdersListPage'
import { OrderRequestPage } from './pages/OrderRequestPage'
import { OrderDetailPage } from './pages/OrderDetailPage'
import { UsersPage } from './pages/UsersPage'

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Navigate to="/productos" replace />} />
        <Route path="/productos" element={<ProductsPage />} />
        <Route path="/productos/:id" element={<ProductDetailPage />} />
        <Route path="/precios" element={<PricingPage />} />
        <Route path="/pedidos" element={<OrdersListPage />} />
        <Route path="/pedidos/nuevo" element={<OrderRequestPage />} />
        <Route path="/pedidos/:id" element={<OrderDetailPage />} />
        <Route path="/usuarios" element={<UsersPage />} />
        <Route path="*" element={<Navigate to="/productos" replace />} />
      </Route>
    </Routes>
  )
}

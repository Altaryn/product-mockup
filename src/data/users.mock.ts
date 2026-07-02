import type { PermissionArea, PermissionLevel, User } from './types'

export const permissionAreas: PermissionArea[] = [
  'Productos',
  'Precios',
  'Pedidos',
  'Proveedores',
  'Usuarios',
]

export const permissionLevels: PermissionLevel[] = ['sin-acceso', 'lectura', 'edicion', 'admin']

export const permissionLevelLabel: Record<PermissionLevel, string> = {
  'sin-acceso': 'Sin acceso',
  lectura: 'Lectura',
  edicion: 'Edición',
  admin: 'Admin',
}

/** Convenience presets applied when picking a role in the user editor. */
export const rolePresets: Record<string, Record<PermissionArea, PermissionLevel>> = {
  Administrador: { Productos: 'admin', Precios: 'admin', Pedidos: 'admin', Proveedores: 'admin', Usuarios: 'admin' },
  Comprador: { Productos: 'edicion', Precios: 'edicion', Pedidos: 'edicion', Proveedores: 'lectura', Usuarios: 'sin-acceso' },
  Comercial: { Productos: 'lectura', Precios: 'lectura', Pedidos: 'edicion', Proveedores: 'sin-acceso', Usuarios: 'sin-acceso' },
  'Logística': { Productos: 'lectura', Precios: 'sin-acceso', Pedidos: 'lectura', Proveedores: 'lectura', Usuarios: 'sin-acceso' },
  'Solo lectura': { Productos: 'lectura', Precios: 'lectura', Pedidos: 'lectura', Proveedores: 'lectura', Usuarios: 'sin-acceso' },
}

export const roles = Object.keys(rolePresets)

export const users: User[] = [
  {
    id: 'u-001',
    name: 'Carlos Alfaro',
    email: 'calfaro@tw.cl',
    role: 'Administrador',
    status: 'activo',
    permissions: rolePresets['Administrador'],
  },
  {
    id: 'u-002',
    name: 'María Fuentes',
    email: 'mfuentes@knauf.cl',
    role: 'Comprador',
    status: 'activo',
    permissions: rolePresets['Comprador'],
  },
  {
    id: 'u-003',
    name: 'Diego Rojas',
    email: 'drojas@knauf.cl',
    role: 'Comercial',
    status: 'activo',
    permissions: rolePresets['Comercial'],
  },
  {
    id: 'u-004',
    name: 'Paula Herrera',
    email: 'pherrera@knauf.cl',
    role: 'Logística',
    status: 'invitado',
    permissions: rolePresets['Logística'],
  },
  {
    id: 'u-005',
    name: 'Auditoría Externa',
    email: 'auditoria@partner.cl',
    role: 'Solo lectura',
    status: 'inactivo',
    permissions: rolePresets['Solo lectura'],
  },
]

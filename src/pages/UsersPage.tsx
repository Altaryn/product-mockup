import { useState } from 'react'
import type { PermissionArea, PermissionLevel, User } from '../data/types'
import { users as seedUsers, roles, rolePresets } from '../data/users.mock'
import { PageHeader } from '../components/ui/PageHeader'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Field, Input, SelectField } from '../components/ui/Field'
import { Modal } from '../components/ui/Modal'
import { UserStatusBadge, Badge } from '../components/ui/Badge'
import { PermissionMatrix, PermissionSummary } from '../components/users/PermissionMatrix'
import { IconPlus, IconPencil, IconUsers } from '../components/ui/icons'

const initials = (name: string) =>
  name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()

const emptyUser = (): User => ({
  id: '',
  name: '',
  email: '',
  role: 'Comprador',
  status: 'invitado',
  permissions: { ...rolePresets['Comprador'] },
})

export function UsersPage() {
  const [users, setUsers] = useState<User[]>(seedUsers)
  const [draft, setDraft] = useState<User | null>(null)
  const isNew = draft?.id === ''

  const openNew = () => setDraft(emptyUser())
  const openEdit = (u: User) => setDraft({ ...u, permissions: { ...u.permissions } })

  const save = () => {
    if (!draft) return
    if (isNew) {
      setUsers((us) => [...us, { ...draft, id: `u-${String(us.length + 1).padStart(3, '0')}` }])
    } else {
      setUsers((us) => us.map((u) => (u.id === draft.id ? draft : u)))
    }
    setDraft(null)
  }

  const setDraftField = <K extends keyof User>(key: K, value: User[K]) =>
    setDraft((d) => (d ? { ...d, [key]: value } : d))

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Administración"
        title="Usuarios y permisos"
        subtitle="Crea perfiles y configura permisos por área y función. Vista de administrador."
        actions={
          <Button onClick={openNew}>
            <IconPlus size={18} /> Nuevo usuario
          </Button>
        }
      />

      {/* Summary strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Usuarios" value={String(users.length)} />
        <StatCard label="Activos" value={String(users.filter((u) => u.status === 'activo').length)} />
        <StatCard label="Administradores" value={String(users.filter((u) => u.role === 'Administrador').length)} />
        <StatCard label="Roles" value={String(roles.length)} />
      </div>

      {/* Desktop table */}
      <Card className="hidden overflow-hidden md:block">
        <table className="w-full text-body-md">
          <thead>
            <tr className="border-b border-hairline text-left text-caption uppercase tracking-wide text-content-muted">
              <th className="px-4 py-3 font-medium">Usuario</th>
              <th className="px-4 py-3 font-medium">Rol</th>
              <th className="px-4 py-3 font-medium">Permisos por área</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-hairline last:border-0 hover:bg-surface-3/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-violet-deep text-caption font-semibold text-on-primary">
                      {initials(u.name)}
                    </span>
                    <div className="min-w-0">
                      <div className="font-medium text-content">{u.name}</div>
                      <div className="text-caption text-content-muted">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge tone="neutral">{u.role}</Badge>
                </td>
                <td className="px-4 py-3">
                  <PermissionSummary permissions={u.permissions} />
                </td>
                <td className="px-4 py-3">
                  <UserStatusBadge status={u.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(u)}>
                    <IconPencil size={16} /> Editar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {users.map((u) => (
          <Card key={u.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-violet-deep text-caption font-semibold text-on-primary">
                  {initials(u.name)}
                </span>
                <div className="min-w-0">
                  <div className="font-medium text-content">{u.name}</div>
                  <div className="text-caption text-content-muted">{u.email}</div>
                </div>
              </div>
              <UserStatusBadge status={u.status} />
            </div>
            <div className="mt-3 flex items-center gap-2">
              <Badge tone="neutral">{u.role}</Badge>
            </div>
            <div className="mt-3">
              <PermissionSummary permissions={u.permissions} />
            </div>
            <Button variant="outline" size="sm" className="mt-3 w-full" onClick={() => openEdit(u)}>
              <IconPencil size={16} /> Editar permisos
            </Button>
          </Card>
        ))}
      </div>

      {/* Editor modal */}
      <Modal
        open={draft !== null}
        onClose={() => setDraft(null)}
        size="lg"
        title={
          <span className="flex items-center gap-2">
            <IconUsers size={20} /> {isNew ? 'Nuevo usuario' : 'Editar usuario'}
          </span>
        }
        footer={
          <>
            <Button variant="ghost" onClick={() => setDraft(null)}>
              Cancelar
            </Button>
            <Button onClick={save} disabled={!draft?.name || !draft?.email}>
              {isNew ? 'Crear usuario' : 'Guardar cambios'}
            </Button>
          </>
        }
      >
        {draft && (
          <div className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Nombre">
                <Input
                  value={draft.name}
                  placeholder="Nombre y apellido"
                  onChange={(e) => setDraftField('name', e.target.value)}
                />
              </Field>
              <Field label="Email">
                <Input
                  type="email"
                  value={draft.email}
                  placeholder="usuario@knauf.cl"
                  onChange={(e) => setDraftField('email', e.target.value)}
                />
              </Field>
              <SelectField
                label="Rol"
                hint="Al cambiar el rol se aplican permisos sugeridos (puedes ajustarlos)."
                value={draft.role}
                onChange={(e) => {
                  const role = e.target.value
                  setDraft((d) =>
                    d ? { ...d, role, permissions: { ...rolePresets[role] } } : d,
                  )
                }}
              >
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </SelectField>
              <SelectField
                label="Estado"
                value={draft.status}
                onChange={(e) => setDraftField('status', e.target.value as User['status'])}
              >
                <option value="activo">Activo</option>
                <option value="invitado">Invitado</option>
                <option value="inactivo">Inactivo</option>
              </SelectField>
            </div>

            <div>
              <h4 className="mb-2 text-micro-cap uppercase text-content-muted">Permisos por área</h4>
              <PermissionMatrix
                value={draft.permissions}
                onChange={(permissions: Record<PermissionArea, PermissionLevel>) =>
                  setDraftField('permissions', permissions)
                }
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-4">
      <div className="text-micro-cap uppercase text-content-faint">{label}</div>
      <div className="mt-1 font-display text-heading-md text-content tabular-nums">{value}</div>
    </Card>
  )
}

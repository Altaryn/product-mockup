import { useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppState } from '../store'
import { suppliers } from '../data/suppliers.mock'
import type { Product, ProductStatus, SourcingType, TechAttribute } from '../data/types'
import { formatCLP } from '../lib/format'
import { cn } from '../lib/cn'
import { PageHeader } from '../components/ui/PageHeader'
import { Card, SectionTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Field, Input, SelectField } from '../components/ui/Field'
import { Badge, ProductStatusBadge, SourcingBadges } from '../components/ui/Badge'
import {
  IconChevronRight,
  IconPlus,
  IconTrash,
  IconBox,
  IconSliders,
  IconTruck,
  IconBuilding,
  IconCheck,
} from '../components/ui/icons'

const UNITS = ['m²', 'un', 'saco', 'caja', 'rollo', 'plancha', 'ml', 'kg']
const TECH_GROUPS: TechAttribute['group'][] = ['Dimensiones', 'Prestaciones', 'Material', 'Normativa']

const STATUS_OPTIONS: { value: ProductStatus; label: string }[] = [
  { value: 'borrador', label: 'Borrador' },
  { value: 'activo', label: 'Activo' },
  { value: 'descontinuado', label: 'Descontinuado' },
]
const SOURCING_OPTIONS: { value: SourcingType; label: string }[] = [
  { value: 'fabricacion', label: 'Fabricación propia' },
  { value: 'compra', label: 'Compra a externo' },
  { value: 'reventa', label: 'Reventa entre sedes' },
]

interface TechRow {
  id: string
  label: string
  value: string
  unit: string
  group: TechAttribute['group']
}

/** Deriva un id estable y único a partir del código SKU. */
function makeId(code: string, existing: Product[]): string {
  const slug =
    code
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'sku'
  const ids = new Set(existing.map((p) => p.id))
  let id = `p-${slug}`
  let n = 2
  while (ids.has(id)) id = `p-${slug}-${n++}`
  return id
}

export function NewProductPage() {
  const { products, addProduct } = useAppState()
  const navigate = useNavigate()

  // Identificación
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [subcategory, setSubcategory] = useState('')
  const [family, setFamily] = useState('')
  const [unit, setUnit] = useState('m²')
  const [status, setStatus] = useState<ProductStatus>('borrador')
  const [sourcing, setSourcing] = useState<SourcingType[]>(['fabricacion'])
  // Comercial
  const [basePrice, setBasePrice] = useState(0)
  // Ficha técnica
  const techSeq = useRef(1)
  const [tech, setTech] = useState<TechRow[]>([
    { id: 't0', label: '', value: '', unit: '', group: 'Dimensiones' },
  ])
  // Logística
  const [unitsPerPallet, setUnitsPerPallet] = useState(50)
  const [palletWeightKg, setPalletWeightKg] = useState(500)
  const [cont20, setCont20] = useState(10)
  const [cont40, setCont40] = useState(20)
  const [cont40hc, setCont40hc] = useState(22)
  // Proveedores
  const [supplierIds, setSupplierIds] = useState<string[]>([])

  const [submitted, setSubmitted] = useState(false)

  const categoryOptions = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))).sort((a, b) => a.localeCompare(b, 'es')),
    [products],
  )
  const familyOptions = useMemo(
    () => Array.from(new Set(products.map((p) => p.family))).sort((a, b) => a.localeCompare(b, 'es')),
    [products],
  )

  const errors = {
    code: !code.trim() ? 'Ingresa un código SKU.' : '',
    name: !name.trim() ? 'Ingresa un nombre.' : '',
    category: !category.trim() ? 'Indica una categoría.' : '',
    basePrice: !(basePrice > 0) ? 'Ingresa un precio base mayor a 0.' : '',
    sourcing: sourcing.length === 0 ? 'Selecciona al menos un origen.' : '',
  }
  const isValid =
    !errors.code && !errors.name && !errors.category && !errors.basePrice && !errors.sourcing

  const updateTech = (id: string, patch: Partial<TechRow>) =>
    setTech((ts) => ts.map((t) => (t.id === id ? { ...t, ...patch } : t)))
  const addTechRow = () =>
    setTech((ts) => [
      ...ts,
      { id: `t${techSeq.current++}`, label: '', value: '', unit: '', group: 'Dimensiones' },
    ])
  const removeTechRow = (id: string) => setTech((ts) => ts.filter((t) => t.id !== id))
  const toggleSupplier = (id: string) =>
    setSupplierIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]))
  const toggleSourcing = (v: SourcingType) =>
    setSourcing((s) => (s.includes(v) ? s.filter((x) => x !== v) : [...s, v]))

  const submit = () => {
    setSubmitted(true)
    if (!isValid) return
    const id = makeId(code, products)
    const product: Product = {
      id,
      code: code.trim(),
      name: name.trim(),
      category: category.trim(),
      subcategory: subcategory.trim() || 'General',
      family: family.trim() || 'General',
      status,
      sourcing,
      unit,
      basePrice,
      currency: 'CLP',
      updatedAt: new Date().toISOString().slice(0, 10),
      tech: tech
        .filter((t) => t.label.trim() && t.value.trim())
        .map((t) => ({
          label: t.label.trim(),
          value: t.value.trim(),
          unit: t.unit.trim() || undefined,
          group: t.group,
        })),
      commercial: {
        priceLists: [],
        volumeTiers: [{ min: 1, max: null, discountPct: 0 }],
        familyDiscounts: [],
      },
      logistics: {
        unitsPerPallet,
        palletWeightKg,
        palletsPerContainer: [
          { container: "Contenedor 20'", pallets: cont20 },
          { container: "Contenedor 40'", pallets: cont40 },
          { container: "Contenedor 40' HC", pallets: cont40hc },
        ],
      },
      supplierIds,
    }
    addProduct(product)
    navigate(`/productos/${id}`)
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-caption text-content-muted">
        <Link to="/productos" className="hover:text-content">
          Productos
        </Link>
        <IconChevronRight size={14} />
        <span className="text-content">Nuevo producto</span>
      </nav>

      <PageHeader
        eyebrow="Catálogo"
        title="Nuevo producto"
        subtitle="Crea un SKU con su información técnica, comercial, logística y de proveedores. Queda disponible en el catálogo apenas se crea."
      />

      {/* Live preview */}
      <Card className="p-5">
        <SectionTitle eyebrow="Vista previa" title="Así se verá en el catálogo" icon={<IconBox size={13} />} />
        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-code text-content-muted">{code.trim() || 'CÓDIGO-SKU'}</span>
              <ProductStatusBadge status={status} />
              <SourcingBadges sourcing={sourcing} />
            </div>
            <div className="mt-1 font-display text-heading-sm text-content">
              {name.trim() || 'Nombre del producto'}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge tone="neutral">{category.trim() || 'Categoría'}</Badge>
              {subcategory.trim() && <Badge tone="neutral">{subcategory.trim()}</Badge>}
              {family.trim() && <Badge tone="neutral">{family.trim()}</Badge>}
            </div>
          </div>
          <div className="text-right">
            <div className="text-micro-cap uppercase text-content-faint">Precio base</div>
            <div className="font-display text-heading-md text-content tabular-nums">
              {basePrice > 0 ? formatCLP(basePrice) : '—'}
              <span className="text-body-md font-normal text-content-faint"> /{unit}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Identificación */}
      <Card className="p-5">
        <SectionTitle eyebrow="Identificación" title="Datos generales" icon={<IconBox size={13} />} />
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Código SKU">
            <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="p. ej. PYC-STD-125" />
            <FieldError show={submitted} msg={errors.code} />
          </Field>
          <Field label="Nombre del producto">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="p. ej. Placa Yeso Cartón Estándar 12,5 mm"
            />
            <FieldError show={submitted} msg={errors.name} />
          </Field>
          <Field label="Categoría">
            <Input
              list="cat-list"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Selecciona o escribe una categoría"
            />
            <datalist id="cat-list">
              {categoryOptions.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
            <FieldError show={submitted} msg={errors.category} />
          </Field>
          <Field label="Subcategoría">
            <Input
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              placeholder="p. ej. Estándar"
            />
          </Field>
          <Field label="Familia / sistema">
            <Input
              list="fam-list"
              value={family}
              onChange={(e) => setFamily(e.target.value)}
              placeholder="p. ej. Sistema Placa"
            />
            <datalist id="fam-list">
              {familyOptions.map((f) => (
                <option key={f} value={f} />
              ))}
            </datalist>
          </Field>
          <SelectField label="Unidad comercial" value={unit} onChange={(e) => setUnit(e.target.value)}>
            {UNITS.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </SelectField>
          <SelectField
            label="Estado"
            value={status}
            onChange={(e) => setStatus(e.target.value as ProductStatus)}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </SelectField>
          <Field label="Origen (sourcing)">
            <div className="flex flex-wrap gap-2">
              {SOURCING_OPTIONS.map((s) => {
                const on = sourcing.includes(s.value)
                return (
                  <button
                    type="button"
                    key={s.value}
                    onClick={() => toggleSourcing(s.value)}
                    aria-pressed={on}
                    className={cn(
                      'rounded-sm border px-3 py-2 text-body-md transition-colors',
                      on
                        ? 'border-violet bg-violet/10 font-medium text-violet'
                        : 'border-hairline-strong text-content-muted hover:bg-surface-2',
                    )}
                  >
                    {s.label}
                  </button>
                )
              })}
            </div>
            <p className="mt-1 text-caption text-content-faint">
              Puede ser más de uno (p. ej. fabricación propia + importación entre sedes).
            </p>
            <FieldError show={submitted} msg={errors.sourcing} />
          </Field>
        </div>
      </Card>

      {/* Comercial */}
      <Card className="p-5">
        <SectionTitle eyebrow="Comercial" title="Precio base" icon={<IconSliders size={13} />} />
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Precio base (CLP)">
            <Input
              type="number"
              min={0}
              value={basePrice || ''}
              onChange={(e) => setBasePrice(Math.max(0, Number(e.target.value)))}
              placeholder="0"
            />
            <FieldError show={submitted} msg={errors.basePrice} />
          </Field>
          <Field label="Moneda" hint="El mockup opera en pesos chilenos.">
            <Input value="CLP" disabled className="opacity-70" />
          </Field>
        </div>
        <p className="mt-3 text-caption text-content-faint">
          Las listas por cliente y los tramos de descuento por volumen se configuran en el módulo{' '}
          <span className="text-content-muted">Precios</span> una vez creado el producto.
        </p>
      </Card>

      {/* Ficha técnica */}
      <Card className="p-5">
        <SectionTitle
          eyebrow="Ficha técnica"
          title="Atributos"
          icon={<IconBox size={13} />}
          action={
            <Button variant="outline" size="sm" onClick={addTechRow}>
              <IconPlus size={16} /> Agregar
            </Button>
          }
        />
        <div className="mt-4 space-y-2">
          <div className="hidden gap-2 px-1 text-micro-cap uppercase text-content-faint sm:grid sm:grid-cols-12">
            <div className="sm:col-span-4">Atributo</div>
            <div className="sm:col-span-3">Valor</div>
            <div className="sm:col-span-2">Unidad</div>
            <div className="sm:col-span-2">Grupo</div>
            <div className="sm:col-span-1" />
          </div>
          {tech.map((t) => (
            <div key={t.id} className="grid gap-2 sm:grid-cols-12 sm:items-center">
              <Input
                className="sm:col-span-4"
                value={t.label}
                onChange={(e) => updateTech(t.id, { label: e.target.value })}
                placeholder="p. ej. Espesor"
              />
              <Input
                className="sm:col-span-3"
                value={t.value}
                onChange={(e) => updateTech(t.id, { value: e.target.value })}
                placeholder="p. ej. 12,5"
              />
              <Input
                className="sm:col-span-2"
                value={t.unit}
                onChange={(e) => updateTech(t.id, { unit: e.target.value })}
                placeholder="mm"
              />
              <SelectField
                className="sm:col-span-2"
                value={t.group}
                onChange={(e) => updateTech(t.id, { group: e.target.value as TechAttribute['group'] })}
              >
                {TECH_GROUPS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </SelectField>
              <button
                type="button"
                onClick={() => removeTechRow(t.id)}
                disabled={tech.length === 1}
                aria-label="Quitar atributo"
                className="flex h-[42px] items-center justify-center rounded-sm border border-hairline-strong text-content-muted transition-colors hover:bg-surface-3 disabled:opacity-40 sm:col-span-1"
              >
                <IconTrash size={16} />
              </button>
            </div>
          ))}
        </div>
        <p className="mt-3 text-caption text-content-faint">
          Se agrupan por sección en la ficha (Dimensiones, Prestaciones, Material, Normativa). Las filas
          vacías se ignoran.
        </p>
      </Card>

      {/* Logística */}
      <Card className="p-5">
        <SectionTitle eyebrow="Logística" title="Paletizado y carga" icon={<IconTruck size={13} />} />
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label={`Unidades por pallet (${unit})`}>
            <Input
              type="number"
              min={1}
              value={unitsPerPallet}
              onChange={(e) => setUnitsPerPallet(Math.max(1, Number(e.target.value)))}
            />
          </Field>
          <Field label="Peso por pallet (kg)">
            <Input
              type="number"
              min={0}
              value={palletWeightKg}
              onChange={(e) => setPalletWeightKg(Math.max(0, Number(e.target.value)))}
            />
          </Field>
        </div>
        <h4 className="mt-5 text-micro-cap uppercase text-content-muted">Pallets por tipo de contenedor</h4>
        <div className="mt-2 grid gap-4 sm:grid-cols-3">
          <Field label="Contenedor 20'">
            <Input
              type="number"
              min={0}
              value={cont20}
              onChange={(e) => setCont20(Math.max(0, Number(e.target.value)))}
            />
          </Field>
          <Field label="Contenedor 40'">
            <Input
              type="number"
              min={0}
              value={cont40}
              onChange={(e) => setCont40(Math.max(0, Number(e.target.value)))}
            />
          </Field>
          <Field label="Contenedor 40' HC">
            <Input
              type="number"
              min={0}
              value={cont40hc}
              onChange={(e) => setCont40hc(Math.max(0, Number(e.target.value)))}
            />
          </Field>
        </div>
      </Card>

      {/* Proveedores */}
      <Card className="p-5">
        <SectionTitle
          eyebrow="Proveedores"
          title="Origen de abastecimiento"
          icon={<IconBuilding size={13} />}
        />
        <p className="mt-2 text-caption text-content-faint">
          Referencia al futuro módulo Supplier Master. Selecciona los proveedores del producto.
        </p>
        <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
          {suppliers.map((s) => {
            const checked = supplierIds.includes(s.id)
            return (
              <label
                key={s.id}
                className={cn(
                  'flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors',
                  checked ? 'border-violet bg-violet/8' : 'border-hairline hover:bg-surface-2',
                )}
              >
                <input
                  type="checkbox"
                  className="mt-0.5 accent-violet"
                  checked={checked}
                  onChange={() => toggleSupplier(s.id)}
                />
                <span className="min-w-0">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-body-md font-medium text-content">{s.name}</span>
                    <Badge tone={s.type === 'interno' ? 'violet' : 'neutral'}>
                      {s.type === 'interno' ? 'Interno' : 'Externo'}
                    </Badge>
                  </span>
                  <span className="mt-0.5 block font-mono text-caption text-content-faint">
                    {s.id} · {s.country} · {s.leadTimeDays} días
                  </span>
                </span>
              </label>
            )
          })}
        </div>
      </Card>

      {/* Footer actions */}
      <Card className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-caption text-content-muted">
          {submitted && !isValid ? (
            <span className="text-pink">Revisa los campos obligatorios marcados.</span>
          ) : (
            <>Campos obligatorios: código, nombre, categoría y precio base.</>
          )}
        </div>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Link to="/productos">
            <Button variant="outline" className="w-full sm:w-auto">
              Cancelar
            </Button>
          </Link>
          <Button onClick={submit} className="w-full sm:w-auto">
            <IconCheck size={18} /> Crear producto
          </Button>
        </div>
      </Card>
    </div>
  )
}

function FieldError({ show, msg }: { show: boolean; msg: string }) {
  if (!show || !msg) return null
  return <p className="mt-1 text-caption text-pink">{msg}</p>
}

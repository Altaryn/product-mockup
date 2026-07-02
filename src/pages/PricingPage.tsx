import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { products, productById } from '../data/products.mock'
import { clients, clientById } from '../data/clients.mock'
import type { FamilyDiscount, PriceListEntry, VolumeTier } from '../data/types'
import { formatCLP } from '../lib/format'
import { PageHeader } from '../components/ui/PageHeader'
import { Card, SectionTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Field, Input, SelectField } from '../components/ui/Field'
import { Badge } from '../components/ui/Badge'
import { VolumeTierEditor } from '../components/pricing/VolumeTierEditor'
import { FamilyDiscountEditor } from '../components/pricing/FamilyDiscountEditor'
import { VolumeTierTable } from '../components/detail/VolumeTierTable'
import { IconCheck, IconSliders, IconLayers, IconTag } from '../components/ui/icons'

interface Draft {
  basePrice: number
  priceLists: PriceListEntry[]
  volumeTiers: VolumeTier[]
  familyDiscounts: FamilyDiscount[]
}

function draftFrom(id: string): Draft {
  const p = productById(id)!
  return {
    basePrice: p.basePrice,
    priceLists: p.commercial.priceLists.map((e) => ({ ...e })),
    volumeTiers: p.commercial.volumeTiers.map((t) => ({ ...t })),
    familyDiscounts: p.commercial.familyDiscounts.map((f) => ({ ...f })),
  }
}

export function PricingPage() {
  const [params] = useSearchParams()
  const initial = params.get('product') && productById(params.get('product')!) ? params.get('product')! : products[0].id

  const [productId, setProductId] = useState(initial)
  const [listClientId, setListClientId] = useState('CL-000') // CL-000 = lista general
  const [draft, setDraft] = useState<Draft>(() => draftFrom(initial))
  const [saved, setSaved] = useState(false)

  // Reset draft whenever the edited product changes.
  useEffect(() => {
    setDraft(draftFrom(productId))
    setListClientId('CL-000')
    setSaved(false)
  }, [productId])

  const product = productById(productId)!
  const isGeneral = listClientId === 'CL-000'
  const entry = draft.priceLists.find((e) => e.clientId === listClientId)
  const currentPrice = isGeneral ? draft.basePrice : entry?.price ?? draft.basePrice

  const setCurrentPrice = (price: number) => {
    setSaved(false)
    if (isGeneral) {
      setDraft((d) => ({ ...d, basePrice: price }))
    } else {
      setDraft((d) => {
        const exists = d.priceLists.some((e) => e.clientId === listClientId)
        const priceLists = exists
          ? d.priceLists.map((e) => (e.clientId === listClientId ? { ...e, price } : e))
          : [...d.priceLists, { clientId: listClientId, price }]
        return { ...d, priceLists }
      })
    }
  }

  const removeList = (clientId: string) => {
    setSaved(false)
    setDraft((d) => ({ ...d, priceLists: d.priceLists.filter((e) => e.clientId !== clientId) }))
  }

  const patch = (p: Partial<Draft>) => {
    setSaved(false)
    setDraft((d) => ({ ...d, ...p }))
  }

  const deltaVsBase = useMemo(
    () => (isGeneral ? 0 : Math.round(((currentPrice - draft.basePrice) / draft.basePrice) * 100)),
    [isGeneral, currentPrice, draft.basePrice],
  )

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Gestión"
        title="Precios"
        subtitle="Carga y edita listas de precios (general y por cliente), tramos de descuento por volumen y descuentos por familia."
        actions={
          <Button onClick={() => setSaved(true)}>
            {saved ? (
              <>
                <IconCheck size={18} /> Guardado
              </>
            ) : (
              'Guardar cambios'
            )}
          </Button>
        }
      />

      {/* Product + list selectors */}
      <Card className="p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <SelectField
            label="Producto"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code} · {p.name}
              </option>
            ))}
          </SelectField>
          <SelectField
            label="Lista de precios activa"
            value={listClientId}
            onChange={(e) => {
              setListClientId(e.target.value)
              setSaved(false)
            }}
          >
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.id === 'CL-000' ? 'Lista general (base)' : `${c.name} · ${c.priceListName}`}
              </option>
            ))}
          </SelectField>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Price list editor */}
        <Card className="p-5">
          <SectionTitle eyebrow="Listas de precio" title="Precio de lista" icon={<IconTag size={13} />} />
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Field
              label={isGeneral ? 'Precio base (general)' : `Precio para ${clientById(listClientId)?.name ?? ''}`}
              hint={`En CLP por ${product.unit}`}
            >
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-content-faint">
                  $
                </span>
                <Input
                  type="number"
                  min={0}
                  value={currentPrice}
                  onChange={(e) => setCurrentPrice(Number(e.target.value))}
                  className="pl-7 tabular-nums"
                />
              </div>
            </Field>
            <Field label="Comparación vs. base">
              <div className="flex h-[42px] items-center gap-2 rounded-sm border border-hairline bg-surface-2 px-3">
                {isGeneral ? (
                  <span className="text-body-md text-content-muted">Es la lista base</span>
                ) : (
                  <>
                    <span className="text-body-md font-medium text-content tabular-nums">
                      {formatCLP(draft.basePrice)}
                    </span>
                    <Badge tone={deltaVsBase < 0 ? 'violet' : deltaVsBase > 0 ? 'pink' : 'muted'}>
                      {deltaVsBase > 0 ? '+' : ''}
                      {deltaVsBase}%
                    </Badge>
                  </>
                )}
              </div>
            </Field>
          </div>

          {/* Summary of all lists */}
          <h4 className="mb-2 mt-5 text-micro-cap uppercase text-content-muted">Listas configuradas</h4>
          <div className="overflow-hidden rounded-lg border border-hairline">
            <table className="w-full text-body-md">
              <tbody>
                <tr className="border-b border-hairline bg-surface-2">
                  <td className="px-3 py-2 text-content">Lista general (base)</td>
                  <td className="px-3 py-2 text-right font-medium tabular-nums text-content">
                    {formatCLP(draft.basePrice)}
                  </td>
                  <td className="px-3 py-2" />
                </tr>
                {draft.priceLists.map((e) => (
                  <tr key={e.clientId} className="border-b border-hairline last:border-0">
                    <td className="px-3 py-2 text-content">{clientById(e.clientId)?.name ?? e.clientId}</td>
                    <td className="px-3 py-2 text-right font-medium tabular-nums text-content">
                      {formatCLP(e.price)}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <button
                        onClick={() => removeList(e.clientId)}
                        className="text-caption text-content-muted hover:text-pink"
                      >
                        Quitar
                      </button>
                    </td>
                  </tr>
                ))}
                {draft.priceLists.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-3 py-3 text-caption text-content-muted">
                      Sin listas por cliente. Selecciona un cliente arriba y define su precio.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Volume tiers */}
        <Card className="p-5">
          <SectionTitle
            eyebrow="Volumen"
            title="Tramos de descuento"
            icon={<IconSliders size={13} />}
          />
          <div className="mt-4">
            <VolumeTierEditor
              tiers={draft.volumeTiers}
              unit={product.unit}
              onChange={(volumeTiers) => patch({ volumeTiers })}
            />
          </div>
          <h4 className="mb-2 mt-5 text-micro-cap uppercase text-content-muted">
            Vista previa sobre lista activa
          </h4>
          <VolumeTierTable tiers={draft.volumeTiers} listPrice={currentPrice} unit={product.unit} />
        </Card>
      </div>

      {/* Family discounts */}
      <Card className="p-5">
        <SectionTitle
          eyebrow="Agrupación"
          title="Descuentos por familia de productos"
          icon={<IconLayers size={13} />}
        />
        <div className="mt-4 max-w-3xl">
          <FamilyDiscountEditor
            items={draft.familyDiscounts}
            onChange={(familyDiscounts) => patch({ familyDiscounts })}
          />
        </div>
      </Card>

      <p className="text-caption text-content-faint">
        Mockup — los cambios se mantienen en memoria local y no se persisten.
      </p>
    </div>
  )
}

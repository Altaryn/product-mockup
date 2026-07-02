import type { TechAttribute } from '../../data/types'
import { Card } from '../ui/Card'

const GROUP_ORDER: TechAttribute['group'][] = ['Dimensiones', 'Prestaciones', 'Material', 'Normativa']

/**
 * Flexible tech-spec renderer: groups attributes by section so any product type
 * (placa, perfil, lana, pasta…) renders with its own variable attribute set.
 */
export function TechSpecs({ tech }: { tech: TechAttribute[] }) {
  const groups = GROUP_ORDER.map((g) => ({
    group: g,
    items: tech.filter((t) => t.group === g),
  })).filter((g) => g.items.length > 0)

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {groups.map(({ group, items }) => (
        <Card key={group} className="p-5">
          <h3 className="text-micro-cap uppercase text-content-muted">{group}</h3>
          <dl className="mt-3 divide-y divide-hairline">
            {items.map((t) => (
              <div key={t.label} className="flex items-baseline justify-between gap-4 py-2.5">
                <dt className="text-body-md text-content-muted">{t.label}</dt>
                <dd className="text-right text-body-md font-medium text-content">
                  {t.value}
                  {t.unit && <span className="text-content-faint font-normal"> {t.unit}</span>}
                </dd>
              </div>
            ))}
          </dl>
        </Card>
      ))}
    </div>
  )
}

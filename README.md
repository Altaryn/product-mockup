# Product Master — Mockup interactivo

Mockup navegable de alta fidelidad para **Product Master**, el módulo de Knauf que
centraliza la información de producto (técnica, comercial, logística y de proveedores).
Sin backend: todo el estado es local y los datos son mock.

Construido sobre el **design system Sentry** (`DESIGN-sentry.md`): canvas de doble
polaridad (claro/oscuro), tipografía Rubik + Space Grotesk, acento violeta con lime
reservado como firma escasa.

## Stack

- **React 18 + TypeScript + Vite**
- **Tailwind CSS** con los tokens del design system mapeados en `tailwind.config.js`
  y variables CSS por tema en `src/index.css`
- **React Router** para navegación entre pantallas

## Correr el proyecto

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck (tsc) + build de producción
```

## Pantallas (conectadas entre sí)

| Ruta | Pantalla |
| --- | --- |
| `/productos` | Listado (tabla ⇄ tarjetas, búsqueda, filtros, orden) |
| `/productos/:id` | Ficha: pestañas **Técnica · Comercial · Logística · Proveedores** |
| `/precios` | Gestión de listas de precio, tramos por volumen y descuentos por familia |
| `/pedidos` | Solicitud de pedido: buscar producto, cantidad, precio vigente, carrito |
| `/usuarios` | Administración de usuarios con matriz de permisos por área |

Modo claro/oscuro con el toggle del topbar. Responsive real: rail lateral en desktop,
menú hamburguesa + tarjetas en tablet/móvil.

## Estructura

```
src/
├─ data/                  # Datos mock centralizados (iterar aquí)
│  ├─ products.mock.ts    # Catálogo (13 SKUs de construcción)
│  ├─ clients.mock.ts     # Clientes / listas de precio
│  ├─ suppliers.mock.ts   # ⚠️ Referencia al módulo Supplier Master (ver nota)
│  ├─ users.mock.ts       # Usuarios, roles y presets de permisos
│  └─ types.ts            # Modelo de dominio
├─ lib/                   # pricing.ts (resolución de precio), format.ts (CLP)
├─ components/
│  ├─ ui/                 # Button, Badge, Card, Field, Tabs, Segmented, Modal…
│  ├─ layout/             # AppShell, Sidebar (rail "night"), Topbar
│  ├─ products/           # ProductTable, ProductCard
│  ├─ detail/             # TechSpecs, CommercialPanel, VolumeTierTable,
│  │                      # LogisticsPanel, PalletContainerViz, SuppliersPanel
│  ├─ pricing/            # VolumeTierEditor, FamilyDiscountEditor
│  └─ users/              # PermissionMatrix (+ summary)
└─ pages/                 # Una página por ruta
```

## Nota — módulo Supplier Master

La pestaña **Proveedores** de la ficha muestra datos referenciados de un módulo
**Supplier Master** que aún no existe. El único punto de integración es
`src/data/suppliers.mock.ts`: en producción se reemplazaría `supplierById()` por una
llamada al módulo real (p. ej. `supplierMaster.getMany(product.supplierIds)`).

## Componentes nuevos (fuera del design system)

Diseñados con los mismos tokens cuando el sistema no los cubría:
- **PalletContainerViz** — visualización de pallets por tipo de contenedor.
- **VolumeTierEditor / FamilyDiscountEditor** — editores de descuentos.
- **PermissionMatrix** — matriz de permisos por área/nivel.

> Mockup: los cambios (precios, permisos, carrito) viven en memoria local y no se persisten.

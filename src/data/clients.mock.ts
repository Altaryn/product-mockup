import type { Client } from './types'

export const clients: Client[] = [
  { id: 'CL-000', name: 'Lista general (pública)', segment: 'Base', priceListName: 'General' },
  { id: 'CL-101', name: 'Constructora Andes Ltda.', segment: 'Constructora', priceListName: 'Constructora A' },
  { id: 'CL-102', name: 'Easy Retail S.A.', segment: 'Retail', priceListName: 'Retail nacional' },
  { id: 'CL-103', name: 'Sodimac Homecenter', segment: 'Retail', priceListName: 'Retail nacional' },
  { id: 'CL-104', name: 'Instaladora DryBuild SpA', segment: 'Instalador', priceListName: 'Instalador Pro' },
  { id: 'CL-105', name: 'Knauf México (intercompañía)', segment: 'Intercompañía', priceListName: 'Transfer price' },
]

export const clientById = (id: string): Client | undefined => clients.find((c) => c.id === id)

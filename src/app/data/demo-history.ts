import type { ViajeGuardado } from '../interfaces/viaje-guardado';
export const DEMO_HISTORY: ViajeGuardado[] = [
  {
    id: 'example-1',
    origin: '[Origen]',
    destination: '[Destino]',
    option: 'direct',
    summary: 'Ruta 0002',
    price: '₡ 000',
    savedAt: null,
  },
  {
    id: 'example-2',
    origin: '[Origen]',
    destination: '[Destino]',
    option: 'transfer',
    summary: 'Ruta [código] + Ruta [código]',
    price: '₡ 000',
    savedAt: null,
  },
  {
    id: 'example-3',
    origin: '[Origen]',
    destination: '[Destino]',
    option: 'direct',
    summary: 'Ruta [código]',
    price: null,
    savedAt: null,
  },
];

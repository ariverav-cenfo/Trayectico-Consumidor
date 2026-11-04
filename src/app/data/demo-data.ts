import type { ParadaRuta } from '../interfaces/parada-ruta';
import type { Aviso } from '../interfaces/aviso';
import type { Ruta } from '../interfaces/ruta';
export const DEMO_ROUTES: Ruta[] = [
  { id: '0002', name: '[Nombre de la ruta]', price: '₡ 000', electronic: false, alert: true },
  { id: '0003', name: '[Nombre de la ruta]', price: '₡ 000', electronic: true, alert: true },
  { id: '0004', name: '[Nombre de la ruta]', price: null, electronic: false, alert: false },
  { id: '0005', name: '[Nombre de la ruta]', price: '₡ 000', electronic: false, alert: false },
  { id: '0006', name: '[Nombre de la ruta]', price: '₡ 000', electronic: true, alert: false },
  { id: '0007', name: '[Nombre de la ruta]', price: null, electronic: false, alert: false },
];
export const DEMO_ALERTS: Aviso[] = [
  {
    id: 'closure',
    routeId: '0002',
    type: 'Cierre de vía',
    title: '[Título del aviso]',
    description: '[Descripción: qué ocurrió y cómo cambia el recorrido.]',
    resolved: false,
  },
  {
    id: 'breakdown',
    routeId: '0003',
    type: 'Avería',
    title: '[Título del aviso]',
    description: '[Descripción del aviso.]',
    resolved: false,
  },
  {
    id: 'blockage',
    routeId: '0004',
    type: 'Bloqueo',
    title: '[Título del aviso]',
    description: '[Descripción del aviso.]',
    resolved: true,
  },
];
export const DEMO_STOPS: ParadaRuta[] = Array.from({ length: 8 }, (_, index) => ({
  id: index + 1,
  name: '[Nombre de la parada]',
}));

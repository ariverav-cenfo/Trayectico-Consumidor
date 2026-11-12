import type { ParadaRuta } from '../interfaces/parada-ruta';
import type { Aviso } from '../interfaces/aviso';
import type { Ruta } from '../interfaces/ruta';
export const RUTAS_DEMO: Ruta[] = [
  { codigo_ruta: '0002', nombre_ruta: '[Nombre de la ruta]' },
  { codigo_ruta: '0003', nombre_ruta: '[Nombre de la ruta]' },
  { codigo_ruta: '0004', nombre_ruta: '[Nombre de la ruta]' },
  { codigo_ruta: '0005', nombre_ruta: '[Nombre de la ruta]' },
  { codigo_ruta: '0006', nombre_ruta: '[Nombre de la ruta]' },
  { codigo_ruta: '0007', nombre_ruta: '[Nombre de la ruta]' },
];
export const AVISOS_DEMO: Aviso[] = [
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
export const PARADAS_DEMO: ParadaRuta[] = Array.from({ length: 8 }, (_, index) => ({
  id: index + 1,
  name: '[Nombre de la parada]',
}));

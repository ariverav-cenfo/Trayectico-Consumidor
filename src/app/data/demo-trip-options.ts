import type { TripOption } from '../interfaces/trip-option';
// Ejemplos para el diseño mientras el servicio de planificación no devuelva viajes reales.
export const EXAMPLE_OPTIONS: TripOption[] = [
  {
    id: 'direct',
    title: 'Opción 1',
    summary: 'Ruta 0002 · [N] paradas · 1 bus',
    routeId: '0002',
    price: '₡ 000',
    payment: 'solo efectivo',
    points: '40,180 100,140 160,146 220,96 280,84 322,48',
    steps: [
      { title: 'Camine a la parada [nombre]', description: '[N] min a pie' },
      {
        title: 'Tome la ruta 0002',
        description: 'Ramal [nombre del ramal], sentido [Ida / Regreso]',
      },
      { title: 'Baje en la parada [nombre]', description: 'Después de [N] paradas' },
      { title: 'Camine a su destino', description: '[N] min a pie' },
    ],
  },
  {
    id: 'transfer',
    title: 'Opción 2',
    summary: 'Ruta [código] + Ruta [código] · [N] paradas · 2 buses',
    routeId: '0002',
    price: '₡ 000',
    payment: 'Consulte el método de pago de cada ruta',
    points: '40,180 100,140 160,96 220,96 280,60 322,48',
    steps: [
      { title: 'Camine a la parada [nombre]', description: '[N] min a pie' },
      {
        title: 'Tome la ruta [código]',
        description: 'Ramal [nombre del ramal], sentido [Ida / Regreso]',
      },
      { title: 'Cambie a la ruta [código]', description: 'En la parada [nombre]' },
      { title: 'Baje en la parada [nombre]', description: 'Después de [N] paradas' },
      { title: 'Camine a su destino', description: '[N] min a pie' },
    ],
  },
];

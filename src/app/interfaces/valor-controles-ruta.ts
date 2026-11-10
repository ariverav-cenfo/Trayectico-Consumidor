import type { SentidoRecorrido } from './recorrido';

/** Ramal y sentido elegidos en los controles del detalle de una ruta. */
export interface ValorControlesRuta {
  ramal: string;
  sentidoRecorrido: SentidoRecorrido;
}

import type { Recorrido } from './recorrido';

/** Variante de una ruta con su propio trayecto, como la devuelve GET /rutas/{codigo}. */
export interface Ramal {
  /** Código del ramal, por ejemplo "0002-A". */
  codigo_ramal: string;
  nombre_ramal: string;
  recorridos: Recorrido[];
}

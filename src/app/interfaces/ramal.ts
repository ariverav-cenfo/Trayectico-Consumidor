import type { Recorrido } from './recorrido';
import type { TarifaRamal } from './tarifa-ramal';

/** Variante de una ruta con su propio trayecto, como la devuelve GET /rutas/{codigo}. */
export interface Ramal {
  /** Código del ramal, por ejemplo "0002-A". */
  codigo_ramal: string;
  nombre_ramal: string;
  /** Tarifa del ramal según ARESEP, o `null` si no hay una tarifa validada. */
  tarifa: TarifaRamal | null;
  recorridos: Recorrido[];
}

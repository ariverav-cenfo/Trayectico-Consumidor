import type { Ramal } from './ramal';
/** Ruta como la devuelve GET /rutas. */
export interface Ruta {
  /** Código de la ruta en el CTP, por ejemplo "0002". */
  codigo_ruta: string;
  /** Nombre de la ruta; el servidor usa el de su primer ramal. */
  nombre_ruta: string;

}

/** Ruta con sus ramales y recorridos, como la devuelve GET /rutas/{codigo}. */
export interface RutaConRamales extends Ruta {
  ramales: Ramal[];
}

/** Sentido de un recorrido según el CTP: de la terminal 1 a la 2, o al revés. */
export type SentidoRecorrido = '1-2' | '2-1';

/** Recorrido de un ramal en un sentido, como lo devuelve GET /rutas/{codigo}. */
export interface Recorrido {
  /** Código del recorrido, por ejemplo "0002-A-1". */
  codigo_recorrido: string;
  sentido_recorrido: SentidoRecorrido;
  /** Indica si el recorrido está habilitado. */
  activo: boolean;
}

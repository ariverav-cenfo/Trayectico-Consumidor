/** Ruta como la devuelve GET /rutas. */
export interface Ruta {
  /** Código de la ruta en el CTP, por ejemplo "0002". */
  codigo_ruta: string;
  /** Nombre de la ruta; el servidor usa el de su primer ramal. */
  nombre_ruta: string;
}

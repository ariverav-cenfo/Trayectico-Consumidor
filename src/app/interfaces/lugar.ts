/**
 * Punto geográfico en WGS84 (EPSG:4326), en el formato acordado en SCRUM-89.
 */
export interface Coordenada {
  lon: number;
  lat: number;
}

/**
 * Lugar sugerido por el servicio de geocodificación.
 */
export interface Lugar {
  /** Nombre principal, por ejemplo "Hospital México". */
  nombre: string;
  /** Detalle para distinguir lugares con el mismo nombre (distrito, cantón, provincia). */
  detalle: string;
  coordenada: Coordenada;
}

/**
 * Resultado de una búsqueda de direcciones.
 * `error` es true cuando el servicio falló, no cuando simplemente no hubo resultados.
 */
export interface ResultadoBusqueda {
  lugares: Lugar[];
  error: boolean;
}

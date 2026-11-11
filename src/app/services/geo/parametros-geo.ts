import { Coordenada } from '../../interfaces/lugar';

/**
 * Rectángulo que envuelve la GAM (iteración 1).
 * PROVISIONAL: reemplazar por la envolvente del límite oficial del Plan GAM 2013-2030
 * (ST_Extent + ST_Transform a 4326). Mismos valores en el endpoint de SCRUM-82.
 */
export const LIMITE_GAM = {
  latMin: 9.75,
  latMax: 10.15,
  lonMin: -84.45,
  lonMax: -83.75,
} as const;

/** Debajo de esta distancia, origen y destino se consideran el mismo punto. */
export const DISTANCIA_MINIMA_METROS = 50;

/** Servidor público de Photon (uso razonable; sin llave). */
export const PHOTON_URL = 'https://photon.komoot.io/api/';
export const MIN_CARACTERES_BUSQUEDA = 3;
export const ESPERA_BUSQUEDA_MS = 300;
export const MAX_SUGERENCIAS = 5;

/** Punto para sesgar los resultados hacia el centro de San José. */
export const CENTRO_GAM: Coordenada = { lat: 9.9281, lon: -84.0907 };

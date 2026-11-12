import { DISTANCIA_MINIMA_METROS, LIMITE_GAM } from './parametros-geo';
import { Coordenada } from '../../interfaces/lugar';

const RADIO_TIERRA_METROS = 6_371_000;

const aRadianes = (grados: number): number => (grados * Math.PI) / 180;

/**
 * Distancia en metros entre dos puntos, con la fórmula de haversine.
 */
export function distanciaMetros(a: Coordenada, b: Coordenada): number {
  const dLat = aRadianes(b.lat - a.lat);
  const dLon = aRadianes(b.lon - a.lon);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(aRadianes(a.lat)) * Math.cos(aRadianes(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * RADIO_TIERRA_METROS * Math.asin(Math.sqrt(h));
}

/**
 * Indica si el punto está dentro del rectángulo de la GAM (bordes incluidos).
 */
export function estaDentroDeGam(punto: Coordenada): boolean {
  return (
    punto.lat >= LIMITE_GAM.latMin &&
    punto.lat <= LIMITE_GAM.latMax &&
    punto.lon >= LIMITE_GAM.lonMin &&
    punto.lon <= LIMITE_GAM.lonMax
  );
}

/**
 * Indica si dos puntos están a menos de la distancia mínima (se consideran el mismo).
 */
export function esMismoPunto(a: Coordenada, b: Coordenada): boolean {
  return distanciaMetros(a, b) < DISTANCIA_MINIMA_METROS;
}

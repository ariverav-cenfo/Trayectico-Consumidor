import { describe, expect, it } from 'vitest';
import { LIMITE_GAM } from './geo.config';
import { Coordenada } from './lugar.model';
import { distanciaMetros, esMismoPunto, estaDentroDeGam } from './geo.utils';

const SAN_JOSE: Coordenada = { lat: 9.9281, lon: -84.0907 };
const LIBERIA: Coordenada = { lat: 10.6346, lon: -85.4377 };
const LIMON: Coordenada = { lat: 9.9907, lon: -83.036 };

/** Metros que mide un grado de latitud con el radio usado en geo.utils. */
const METROS_POR_GRADO = 111_195;

const desplazarNorte = (p: Coordenada, metros: number): Coordenada => ({
  lat: p.lat + metros / METROS_POR_GRADO,
  lon: p.lon,
});

describe('distanciaMetros', () => {
  it('da 0 para el mismo punto', () => {
    expect(distanciaMetros(SAN_JOSE, SAN_JOSE)).toBe(0);
  });

  it('mide un grado de latitud como unos 111 km', () => {
    expect(distanciaMetros(SAN_JOSE, desplazarNorte(SAN_JOSE, METROS_POR_GRADO))).toBeCloseTo(111_195, -2);
  });

  it('da lo mismo en ambos sentidos', () => {
    expect(distanciaMetros(SAN_JOSE, LIMON)).toBeCloseTo(distanciaMetros(LIMON, SAN_JOSE), 6);
  });
});

describe('esMismoPunto', () => {
  it('considera el mismo punto a 49 m', () => {
    expect(esMismoPunto(SAN_JOSE, desplazarNorte(SAN_JOSE, 49))).toBe(true);
  });

  it('considera puntos distintos a 51 m', () => {
    expect(esMismoPunto(SAN_JOSE, desplazarNorte(SAN_JOSE, 51))).toBe(false);
  });
});

describe('estaDentroDeGam', () => {
  it('acepta San José', () => {
    expect(estaDentroDeGam(SAN_JOSE)).toBe(true);
  });

  it('rechaza Liberia y Limón', () => {
    expect(estaDentroDeGam(LIBERIA)).toBe(false);
    expect(estaDentroDeGam(LIMON)).toBe(false);
  });

  it('acepta un punto justo en el borde', () => {
    expect(estaDentroDeGam({ lat: LIMITE_GAM.latMin, lon: -84.0 })).toBe(true);
  });
});

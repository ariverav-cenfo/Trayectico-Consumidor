import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import {
  ErrorUbicacion,
  GEOLOCALIZACION,
  NOMBRE_UBICACION_ACTUAL,
  UbicacionService,
} from './ubicacion.service';

/** Geolocalización falsa que responde con una posición. */
function gpsQueResponde(lat: number, lon: number): Geolocation {
  return {
    getCurrentPosition: vi.fn((exito: PositionCallback) =>
      exito({ coords: { latitude: lat, longitude: lon } } as GeolocationPosition),
    ),
  } as unknown as Geolocation;
}

/** Geolocalización falsa que falla con el código indicado (1, 2 o 3). */
function gpsQueFalla(code: number): Geolocation {
  return {
    getCurrentPosition: vi.fn((_exito: PositionCallback, error?: PositionErrorCallback | null) =>
      error?.({ code } as GeolocationPositionError),
    ),
  } as unknown as Geolocation;
}

function crearServicio(geolocalizacion: Geolocation | null): UbicacionService {
  TestBed.configureTestingModule({
    providers: [{ provide: GEOLOCALIZACION, useValue: geolocalizacion }],
  });
  return TestBed.inject(UbicacionService);
}

describe('UbicacionService', () => {
  it('devuelve la ubicación actual como un lugar', async () => {
    const servicio = crearServicio(gpsQueResponde(9.9281, -84.0907));
    await expect(servicio.obtenerUbicacionActual()).resolves.toEqual({
      nombre: NOMBRE_UBICACION_ACTUAL,
      detalle: '',
      coordenada: { lat: 9.9281, lon: -84.0907 },
    });
  });

  it('informa cuando el permiso está denegado', async () => {
    const servicio = crearServicio(gpsQueFalla(1));
    await expect(servicio.obtenerUbicacionActual()).rejects.toMatchObject({
      motivo: 'permiso-denegado',
    });
  });

  it('informa cuando el GPS no responde a tiempo', async () => {
    const servicio = crearServicio(gpsQueFalla(3));
    await expect(servicio.obtenerUbicacionActual()).rejects.toMatchObject({
      motivo: 'tiempo-agotado',
    });
  });

  it('informa cuando el navegador no tiene GPS', async () => {
    const servicio = crearServicio(null);
    await expect(servicio.obtenerUbicacionActual()).rejects.toBeInstanceOf(ErrorUbicacion);
  });
});

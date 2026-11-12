import { Injectable, InjectionToken, inject } from '@angular/core';
import { Lugar } from '../../interfaces/lugar';

/**
 * API de geolocalización del navegador. Es un token para poder reemplazarla en las pruebas.
 * Vale null si el navegador no la tiene.
 */
export const GEOLOCALIZACION = new InjectionToken<Geolocation | null>('GEOLOCALIZACION', {
  providedIn: 'root',
  factory: () =>
    typeof navigator !== 'undefined' && navigator.geolocation ? navigator.geolocation : null,
});

/** Motivos por los que no se pudo obtener la ubicación. */
export type MotivoErrorUbicacion =
  | 'permiso-denegado'
  | 'no-disponible'
  | 'tiempo-agotado'
  | 'no-soportado';

/**
 * Error al obtener la ubicación. El componente usa `motivo` para elegir el mensaje
 * y pedir que se ingrese el origen manualmente.
 */
export class ErrorUbicacion extends Error {
  constructor(public readonly motivo: MotivoErrorUbicacion) {
    super(`No se pudo obtener la ubicación: ${motivo}`);
    this.name = 'ErrorUbicacion';
  }
}

/** Códigos de GeolocationPositionError definidos por el navegador. */
const MOTIVOS_POR_CODIGO: Record<number, MotivoErrorUbicacion> = {
  1: 'permiso-denegado',
  2: 'no-disponible',
  3: 'tiempo-agotado',
};

/** Nombre que se muestra en el campo de origen cuando se usa el GPS. */
export const NOMBRE_UBICACION_ACTUAL = 'Mi ubicación actual';

/**
 * Obtiene la ubicación actual del usuario con el GPS del dispositivo.
 */
@Injectable({ providedIn: 'root' })
export class UbicacionService {
  private readonly geolocalizacion = inject(GEOLOCALIZACION);

  /**
   * Devuelve la ubicación actual como un Lugar, listo para el campo de origen.
   * Si falla, rechaza con un ErrorUbicacion. Que esté dentro de la GAM lo revisa el validador.
   */
  obtenerUbicacionActual(): Promise<Lugar> {
    const geolocalizacion = this.geolocalizacion;
    if (!geolocalizacion) {
      return Promise.reject(new ErrorUbicacion('no-soportado'));
    }

    return new Promise<Lugar>((resolver, rechazar) => {
      geolocalizacion.getCurrentPosition(
        (posicion) =>
          resolver({
            nombre: NOMBRE_UBICACION_ACTUAL,
            detalle: '',
            coordenada: { lat: posicion.coords.latitude, lon: posicion.coords.longitude },
          }),
        (error) => rechazar(new ErrorUbicacion(MOTIVOS_POR_CODIGO[error.code] ?? 'no-disponible')),
        { enableHighAccuracy: true, timeout: 10_000, maximumAge: 60_000 },
      );
    });
  }
}

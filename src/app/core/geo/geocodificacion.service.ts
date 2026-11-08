import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  Observable,
  OperatorFunction,
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  of,
  switchMap,
} from 'rxjs';
import {
  CENTRO_GAM,
  ESPERA_BUSQUEDA_MS,
  LIMITE_GAM,
  MAX_SUGERENCIAS,
  MIN_CARACTERES_BUSQUEDA,
  PHOTON_URL,
} from './geo.config';
import { Lugar, ResultadoBusqueda } from './lugar.model';

/** Un resultado de Photon (GeoJSON). Los nombres siguen el JSON de Photon. */
interface FeaturePhoton {
  geometry: { coordinates: [number, number] };
  properties: {
    name?: string;
    street?: string;
    housenumber?: string;
    district?: string;
    city?: string;
    county?: string;
    state?: string;
  };
}

/** Respuesta de Photon: una colección GeoJSON. */
interface RespuestaPhoton {
  features: FeaturePhoton[];
}

const SIN_RESULTADOS: ResultadoBusqueda = { lugares: [], error: false };

/**
 * Convierte un resultado de Photon en un Lugar.
 * Ojo: GeoJSON trae las coordenadas como [lon, lat], al revés de nuestro formato.
 */
function aLugar(feature: FeaturePhoton): Lugar {
  const p = feature.properties;
  const [lon, lat] = feature.geometry.coordinates;
  const calle = [p.street, p.housenumber].filter(Boolean).join(' ');
  const nombre = p.name ?? (calle || 'Lugar sin nombre');
  const detalle = [...new Set([p.district, p.city, p.state].filter(Boolean))].join(', ');
  return { nombre, detalle, coordenada: { lat, lon } };
}

/**
 * Busca direcciones dentro de la GAM con Photon (autocompletado).
 * Si se cambia de proveedor (plan B: Geoapify), solo cambia este archivo.
 */
@Injectable({ providedIn: 'root' })
export class GeocodificacionService {
  private readonly http = inject(HttpClient);

  /**
   * Busca lugares que coincidan con el texto.
   * Con menos de 3 letras no consulta y devuelve una lista vacía.
   * Si Photon falla, devuelve { lugares: [], error: true } en vez de lanzar el error.
   */
  buscar(texto: string): Observable<ResultadoBusqueda> {
    const consulta = texto.trim();
    if (consulta.length < MIN_CARACTERES_BUSQUEDA) {
      return of(SIN_RESULTADOS);
    }

    // No se envía "lang": Photon no acepta "es" y sin él devuelve el nombre local.
    const params = new HttpParams()
      .set('q', consulta)
      .set('limit', MAX_SUGERENCIAS)
      .set('lat', CENTRO_GAM.lat)
      .set('lon', CENTRO_GAM.lon)
      .set('bbox', `${LIMITE_GAM.lonMin},${LIMITE_GAM.latMin},${LIMITE_GAM.lonMax},${LIMITE_GAM.latMax}`);

    return this.http.get<RespuestaPhoton>(PHOTON_URL, { params }).pipe(
      map((respuesta) => ({ lugares: respuesta.features.map(aLugar), error: false })),
      catchError(() => of({ lugares: [], error: true })),
    );
  }

  /**
   * Operador para el campo de texto: espera 300 ms sin escribir, ignora el mismo texto
   * repetido y cancela la búsqueda anterior si llega una nueva.
   * Uso en el componente: control.valueChanges.pipe(this.geocodificacion.sugerencias())
   */
  sugerencias(): OperatorFunction<string, ResultadoBusqueda> {
    return (textos$) =>
      textos$.pipe(
        debounceTime(ESPERA_BUSQUEDA_MS),
        map((texto) => texto.trim()),
        distinctUntilChanged(),
        switchMap((texto) => this.buscar(texto)),
      );
  }
}

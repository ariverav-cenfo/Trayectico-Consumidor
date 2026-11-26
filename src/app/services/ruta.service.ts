import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AVISOS_DEMO, PARADAS_DEMO } from '../data/datos-demo';
import { EXAMPLE_OPTIONS } from '../data/demo-trip-options';
import type { ValorFiltrosAvisos } from '../interfaces/valor-filtros-avisos';
import type { ValorControlesRuta } from '../interfaces/valor-controles-ruta';
import type { Ruta, RutaConRamales } from '../interfaces/ruta';
import { environment } from '../../environments/environment';
import type { ParadaRuta } from '../interfaces/parada-ruta';
import type { Aviso } from '../interfaces/aviso';
import type { TripOption } from '../interfaces/trip-option';
import { Observable, catchError, map, of, throwError } from 'rxjs';

/**
 * Acceso a rutas, avisos y paradas. Solo GET /rutas y GET /rutas/{codigo} existen en el backend;
 * avisos, paradas, geometría y opciones de viaje siguen siendo datos de ejemplo.
 */
@Injectable({ providedIn: 'root' })
export class RutaService {
  private readonly baseUrl = environment.apiUrl;

  private readonly rutasUrl = `${this.baseUrl}/api/rutas`;

  constructor(private http: HttpClient) {}

  /** Obtiene todas las rutas */
  obtenerTodasLasRutas(): Observable<Ruta[]> {
    return this.http.get<Ruta[]>(this.rutasUrl).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Busca las rutas cuyo código o nombre contienen el texto indicado.
   * Considera llevar esta lógica al backend en el futuro (ej. /rutas?search=query)
   */
  buscarRutas(query = ''): Observable<Ruta[]> {
    const term = query.trim().toLocaleLowerCase('es');

    return this.http.get<Ruta[]>(this.rutasUrl).pipe(
      map((rutas) =>
        rutas.filter((ruta) =>
          `${ruta.codigo_ruta} ${ruta.nombre_ruta}`
            .toLocaleLowerCase('es')
            .includes(term)
        )
      ),
      catchError(this.handleError)
    );
  }

  /**
   * Obtiene una ruta por su código, con sus ramales, recorridos y la tarifa de cada ramal.
   *
   * @param codigo Código de la ruta en el CTP, por ejemplo "0002".
   * @returns La ruta, o `undefined` si no existe (404). Cualquier otro error se propaga.
   */
  obtenerRuta(codigo: string | null): Observable<RutaConRamales | undefined> {
    if (!codigo) {
      return of(undefined);
    }

    return this.http.get<RutaConRamales>(`${this.rutasUrl}/${encodeURIComponent(codigo)}`).pipe(
      catchError((error) => {
        if (error.status === 404) {
          return of(undefined);
        }
        return this.handleError(error);
      })
    );
  }

  /** Busca los avisos de servicio que cumplen los filtros (datos de ejemplo; sin endpoint en el backend). */
  buscarAvisos(filters?: ValorFiltrosAvisos): Observable<Aviso[]> {
    return of(
      AVISOS_DEMO.filter(
        (alert) =>
          !filters ||
          ((!filters.route || alert.routeId === filters.route) &&
            (!filters.type || alert.type === filters.type)),
      ).map((alert) => ({ ...alert })),
    );
  }

  /** Obtiene el aviso sin resolver de una ruta (datos de ejemplo). */
  obtenerAvisoActivo(routeId: string | null): Observable<Aviso | undefined> {
    return this.buscarAvisos().pipe(
      map((avisos) => avisos.find((alert) => !alert.resolved && alert.routeId === routeId)),
    );
  }

  /** Paradas del ramal elegido, ordenadas según el sentido (datos de ejemplo). */
  obtenerParadas(_routeId: string, controls: ValorControlesRuta): Observable<ParadaRuta[]> {
    const stops = (controls.ramal === 'alterno' ? PARADAS_DEMO.slice(0, 6) : PARADAS_DEMO).map(
      (stop) => ({ ...stop }),
    );
    return of(controls.sentidoRecorrido === '2-1' ? stops.reverse() : stops);
  }

  /** Puntos del trazo de ejemplo que dibuja el mapa para el ramal elegido. */
  obtenerPuntosMapa(_routeId: string, controls: ValorControlesRuta): Observable<string> {
    return of(
      controls.ramal === 'alterno'
        ? '40,180 100,140 160,96 220,96 280,60 322,48'
        : '40,180 100,140 160,146 220,96 280,105 322,65',
    );
  }

  /** Opciones de viaje de ejemplo (copias). */
  getTripOptions(_origen: string, _destino: string): Observable<TripOption[]> {
    return of(
      EXAMPLE_OPTIONS.map((option) => ({
        ...option,
        steps: option.steps.map((step) => ({ ...step })),
      })),
    );
  }

  /** Manejador centralizado de errores HTTP */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.status === 0) {
      errorMessage = 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo y que la URL sea correcta.';
    } else {
      errorMessage = `El servidor devolvió un código de error ${error.status}, el cuerpo de la respuesta fue: ${JSON.stringify(error.error)}`;
    }
    console.error(errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}

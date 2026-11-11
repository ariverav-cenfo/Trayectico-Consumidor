import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { RUTAS_DEMO, AVISOS_DEMO, PARADAS_DEMO } from '../data/datos-demo';
import { EXAMPLE_OPTIONS } from '../data/demo-trip-options';
import type { ValorFiltrosAvisos } from '../interfaces/valor-filtros-avisos';
import type { ValorControlesRuta } from '../interfaces/valor-controles-ruta';
import type { Ruta } from '../interfaces/ruta';
import type { Ramal } from '../interfaces/ramal';
import type { Recorrido } from '../interfaces/recorrido';
import type { ParadaRuta } from '../interfaces/parada-ruta';
import type { Aviso } from '../interfaces/aviso';
import type { TripOption } from '../interfaces/trip-option';
import { Observable, catchError, map, of, throwError } from 'rxjs';

/** Acceso a rutas, avisos y paradas. Los componentes no importan los datos de ejemplo directamente. */
@Injectable({ providedIn: 'root' })
export class RutaService {
  /** URL de la API para acceder a  /GET-rutas. */
  private apiUrl = 'http://localhost:8080/rutas';
  constructor(private http: HttpClient) {}

  /**Obtiene la lista de rutas desde el backend en Spring Boot */
  getRutas(): Observable<Ruta[]> {
    return this.http.get<Ruta[]>(this.apiUrl).pipe(
      map((rutas) => rutas.map((ruta) => ({ ...ruta }))),
      // Manejo de errores
      catchError(this.handleError)
    );
  } 

  /**
   * Busca las rutas cuyo código o nombre contienen el texto indicado.
   * @param query Texto a buscar; si está vacío devuelve todas las rutas.
   * @returns Copias de las rutas encontradas.
   */
  buscarRutas(query = ''): Observable<Ruta[]> {
    const term = query.trim().toLocaleLowerCase('es');
    return of(
      RUTAS_DEMO.filter((ruta) =>
        `${ruta.codigo_ruta} ${ruta.nombre_ruta}`.toLocaleLowerCase('es').includes(term),
      ).map((ruta) => ({ ...ruta })),
    );
  }
  /**
   * Obtiene una ruta por su código.
   * @param codigo Código de la ruta, por ejemplo "0002".
   * @returns La ruta, o `undefined` si no existe.
   */
  obtenerRuta(codigo: string | null): Observable<Ruta | undefined> {
    return this.buscarRutas().pipe(
      map((rutas) => rutas.find((ruta) => ruta.codigo_ruta === codigo)),
    );
  }
  /**
   * Busca los avisos de servicio que cumplen los filtros.
   * @param filters Ruta y tipo de aviso; sin filtros devuelve todos.
   */
  buscarAvisos(filters?: ValorFiltrosAvisos): Aviso[] {
    return AVISOS_DEMO.filter(
      (alert) =>
        !filters ||
        ((!filters.route || alert.routeId === filters.route) &&
          (!filters.type || alert.type === filters.type)),
    ).map((alert) => ({ ...alert }));
  }
  /**
   * Obtiene el aviso sin resolver de una ruta.
   * @param routeId Código de la ruta.
   * @returns El aviso activo, o `undefined` si la ruta no tiene.
   */
  obtenerAvisoActivo(routeId: string | null): Aviso | undefined {
    return this.buscarAvisos().find((alert) => !alert.resolved && alert.routeId === routeId);
  }
  /**
   * Devuelve las paradas del ramal elegido, ordenadas según el sentido elegido.
   * @param controls Ramal y sentido seleccionados en el detalle de la ruta.
   */
  obtenerParadas(controls: ValorControlesRuta): ParadaRuta[] {
    const stops = (controls.ramal === 'alterno' ? PARADAS_DEMO.slice(0, 6) : PARADAS_DEMO).map(
      (stop) => ({ ...stop }),
    );
    return controls.sentidoRecorrido === '2-1' ? stops.reverse() : stops;
  }
  /**
   * Devuelve los puntos del trazo de ejemplo que dibuja el mapa para el ramal elegido.
   * @param controls Ramal y sentido seleccionados en el detalle de la ruta.
   */
  obtenerPuntosMapa(controls: ValorControlesRuta): string {
    return controls.ramal === 'alterno'
      ? '40,180 100,140 160,96 220,96 280,60 322,48'
      : '40,180 100,140 160,146 220,96 280,105 322,65';
  }
  /** Devuelve copias de las opciones de viaje de ejemplo. */
  getTripOptions(): TripOption[] {
    return EXAMPLE_OPTIONS.map((option) => ({
      ...option,
      steps: option.steps.map((step) => ({ ...step })),
    }));
  }

  /**Menejador centralizado de errores de HTTP */
  private handleError(error: HttpErrorResponse){
    let errorMessage = '';
    if (error.status === 0) {
      // Ocurrió un error de red o el servidor no respondió.
      errorMessage = 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo y que la URL sea correcta.';
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      errorMessage = `El servidor devolvió un código de error ${error.status}, el cuerpo de la respuesta fue: ${error.error}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}


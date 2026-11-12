import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import type { ValorFiltrosAvisos } from '../interfaces/valor-filtros-avisos';
import type { ValorControlesRuta } from '../interfaces/valor-controles-ruta';
import type { Ruta } from '../interfaces/ruta';
import { environment } from '../../environments/environment';
import type { ParadaRuta } from '../interfaces/parada-ruta';
import type { Aviso } from '../interfaces/aviso';
import type { TripOption } from '../interfaces/trip-option';
import { Observable, catchError, map, of, throwError } from 'rxjs';

/** Acceso a rutas, avisos y paradas mediante el backend de Spring Boot. */
@Injectable({ providedIn: 'root' })
export class RutaService {
  private readonly baseUrl = environment.apiUrl;
  
  private readonly rutasUrl = `${this.baseUrl}/rutas`;
  private readonly avisosUrl = `${this.baseUrl}/avisos`; 
  private readonly viajesUrl = `${this.baseUrl}/viajes/opciones`; 

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
   * Obtiene una ruta por su código.
   */
  obtenerRuta(codigo: string | null): Observable<Ruta | undefined> {
    if (!codigo) {
      return of(undefined);
    }

    return this.http.get<Ruta>(`${this.rutasUrl}/${encodeURIComponent(codigo)}`).pipe(
      catchError((error) => {
        if (error.status === 404) {
          return of(undefined);
        }
        return this.handleError(error);
      })
    );
  }

  /**
   * Consulta el endpoint de avisos aplicando los filtros correspondientes.
   */
  buscarAvisos(filters?: ValorFiltrosAvisos): Observable<Aviso[]> {
    let params = new HttpParams();
    
    if (filters) {
      if (filters.route) params = params.set('routeId', filters.route);
      if (filters.type) params = params.set('type', filters.type);
    }

    return this.http.get<Aviso[]>(this.avisosUrl, { params }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtiene el aviso activo (no resuelto) de una ruta.
   */
  obtenerAvisoActivo(routeId: string | null): Observable<Aviso | undefined> {
    if (!routeId) return of(undefined);

    // Filtramos desde el backend por la ruta, y localmente buscamos el activo
    return this.buscarAvisos({ route: routeId, type: '' }).pipe(
      map(avisos => avisos.find(aviso => !aviso.resolved)),
      catchError(this.handleError)
    );
  }

  /**
   * Obtiene las paradas correspondientes a una ruta, ramal y sentido.
   */
  obtenerParadas(routeId: string, controls: ValorControlesRuta): Observable<ParadaRuta[]> {
    const params = new HttpParams()
      .set('ramal', controls.ramal)
      .set('sentido', controls.sentidoRecorrido);

    return this.http.get<ParadaRuta[]>(`${this.rutasUrl}/${routeId}/paradas`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtiene las geometrías reales del recorrido (ej. un string de coordenadas para un SVG o mapa).
   */
  obtenerPuntosMapa(routeId: string, controls: ValorControlesRuta): Observable<string> {
    const params = new HttpParams()
      .set('ramal', controls.ramal)
      .set('sentido', controls.sentidoRecorrido);

    // Si el backend devuelve texto plano, usamos responseType: 'text'
    // Si devuelve JSON, cambia a get<TipoGeometria> y omite responseType
    return this.http.get(`${this.rutasUrl}/${routeId}/geometria`, { params, responseType: 'text' }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Consulta el endpoint que calcula las opciones de viaje.
   */
  getTripOptions(origen: string, destino: string): Observable<TripOption[]> {
    const params = new HttpParams()
      .set('origen', origen)
      .set('destino', destino);

    return this.http.get<TripOption[]>(this.viajesUrl, { params }).pipe(
      catchError(this.handleError)
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
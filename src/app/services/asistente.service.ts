import { Injectable, inject } from '@angular/core';
import { Observable, map, of, catchError } from 'rxjs';
import { MENSAJES_DEMO } from '../data/asistente-demo';
import type { MensajeAsistente, RespuestaAsistente } from '../interfaces/mensaje-asistente';
import { RutaService } from './ruta.service';

/** Respuestas del asistente conectadas al backend. */
@Injectable({ providedIn: 'root' })
export class AsistenteService {
  private readonly transport = inject(RutaService);

  /** Devuelve copias de los mensajes con los que empieza la conversación. */
  mensajesIniciales(): MensajeAsistente[] {
    return MENSAJES_DEMO.map((message) => ({ ...message }));
  }

  /**
   * Arma la respuesta del asistente según las palabras clave del mensaje.
   * @param text Mensaje escrito por la persona.
   * @returns La respuesta, con la acción realizada y un enlace cuando aplica.
   */
  responder(text: string): Observable<RespuestaAsistente> {
    const normalized = text.toLocaleLowerCase('es');
    const routeId = text.match(/\b\d{4}\b/)?.[0] ?? '0002';

    // 1. Consultar tarifas
    if (/cuesta|tarifa|precio/.test(normalized)) {
      return this.transport.obtenerRuta(routeId).pipe(
        map((route) => ({
          text: route
            ? `La ruta ${route.codigo_ruta}: tarifa no disponible.`
            : `No encontré la ruta ${routeId}.`,
          action: route ? `Consulté la tarifa de la ruta ${route.codigo_ruta}.` : undefined,
          link: route ? `/rutas/${route.codigo_ruta}` : undefined,
        })),
        catchError(() => of({
          text: 'Hubo un error al consultar la tarifa. Por favor intente más tarde.'
        }))
      );
    }

    // 2. Consultar avisos (Refactorizado con RxJS y manejo de errores)
    if (/aviso|alerta|servicio/.test(normalized)) {
      return this.transport.buscarAvisos().pipe(
        map((avisos) => {
          const activos = avisos.filter((alert) => !alert.resolved).length;
          return {
            text: `Hay ${activos} avisos de servicio activos actualmente.`,
            action: 'Busqué los avisos de servicio.',
            link: '/avisos',
          };
        }),
        catchError(() => of({
          text: 'No pude conectar con el servidor para buscar los avisos en este momento.',
          action: 'Fallo al buscar los avisos de servicio.',
          link: '/avisos'
        }))
      );
    }

    // 3. Planificador
    if (/llego|ruta|viaje|ir de/.test(normalized)) {
      return of({
        text: 'Puede indicar su origen y destino en el planificador para consultar las opciones.',
        action: 'Preparé el acceso al planificador de rutas.',
        link: '/planificar',
      });
    }

    // 4. Default
    return of({
      text: 'Puedo ayudarle a consultar rutas, tarifas y avisos de servicio. Pruebe con una de las sugerencias.',
    });
  }
}
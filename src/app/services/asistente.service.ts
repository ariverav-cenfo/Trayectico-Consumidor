import { Injectable, inject } from '@angular/core';
import { MENSAJES_DEMO } from '../data/asistente-demo';
import type { MensajeAsistente, RespuestaAsistente } from '../interfaces/mensaje-asistente';
import { RutaService } from './ruta.service';
@Injectable({ providedIn: 'root' })
export class AsistenteService {
  private readonly transport = inject(RutaService);
  mensajesIniciales(): MensajeAsistente[] {
    return MENSAJES_DEMO.map((message) => ({ ...message }));
  }
  responder(text: string): RespuestaAsistente {
    const normalized = text.toLocaleLowerCase('es');
    const routeId = text.match(/\b\d{4}\b/)?.[0] ?? '0002';
    const route = this.transport.obtenerRuta(routeId);
    let reply: RespuestaAsistente;
    if (/cuesta|tarifa|precio/.test(normalized)) {
      reply = {
        text: route
          ? `La ruta ${route.id}: ${route.price ?? 'tarifa no disponible'}. Tarifa de demostración.`
          : `No encontré la ruta ${routeId} en los datos de demostración.`,
        action: route ? `Consulté la tarifa de la ruta ${route.id}.` : undefined,
        link: route ? `/rutas/${route.id}` : undefined,
      };
    } else if (/aviso|alerta|servicio/.test(normalized)) {
      reply = {
        text: `Hay ${this.transport.buscarAvisos().filter((alert) => !alert.resolved).length} avisos de servicio activos en los datos de demostración.`,
        action: 'Busqué los avisos de servicio.',
        link: '/avisos',
      };
    } else if (/llego|ruta|viaje|ir de/.test(normalized)) {
      reply = {
        text: 'Puede indicar su origen y destino en el planificador para consultar las opciones de demostración.',
        action: 'Preparé el acceso al planificador de rutas.',
        link: '/planificar',
      };
    } else {
      reply = {
        text: 'Puedo ayudarle a consultar rutas, tarifas y avisos de servicio. Pruebe con una de las sugerencias. Esta conversación es una demostración.',
      };
    }

    return reply;
  }
}

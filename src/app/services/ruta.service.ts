import { Injectable } from '@angular/core';
import { RUTAS_DEMO, AVISOS_DEMO, PARADAS_DEMO } from '../data/datos-demo';
import { EXAMPLE_OPTIONS } from '../data/demo-trip-options';
import type { ValorFiltrosAvisos } from '../interfaces/valor-filtros-avisos';
import type { ValorControlesRuta } from '../interfaces/valor-controles-ruta';
import type { Ruta } from '../interfaces/ruta';
import type { ParadaRuta } from '../interfaces/parada-ruta';
import type { Aviso } from '../interfaces/aviso';
import type { TripOption } from '../interfaces/trip-option';

/** Data access for the demo. Components do not import the fixtures directly. */
@Injectable({ providedIn: 'root' })
export class RutaService {
  buscarRutas(query = ''): Ruta[] {
    const term = query.trim().toLocaleLowerCase('es');
    return RUTAS_DEMO.filter((ruta) =>
      `${ruta.codigo_ruta} ${ruta.nombre_ruta}`.toLocaleLowerCase('es').includes(term),
    ).map((ruta) => ({ ...ruta }));
  }
  obtenerRuta(codigo: string | null): Ruta | undefined {
    return this.buscarRutas().find((ruta) => ruta.codigo_ruta === codigo);
  }
  buscarAvisos(filters?: ValorFiltrosAvisos): Aviso[] {
    return AVISOS_DEMO.filter(
      (alert) =>
        !filters ||
        ((!filters.route || alert.routeId === filters.route) &&
          (!filters.type || alert.type === filters.type)),
    ).map((alert) => ({ ...alert }));
  }
  obtenerAvisoActivo(routeId: string | null): Aviso | undefined {
    return this.buscarAvisos().find((alert) => !alert.resolved && alert.routeId === routeId);
  }
  obtenerParadas(controls: ValorControlesRuta): ParadaRuta[] {
    const stops = (controls.ramal === 'alterno' ? PARADAS_DEMO.slice(0, 6) : PARADAS_DEMO).map(
      (stop) => ({ ...stop }),
    );
    return controls.sentidoRecorrido === '2-1' ? stops.reverse() : stops;
  }
  obtenerPuntosMapa(controls: ValorControlesRuta): string {
    return controls.ramal === 'alterno'
      ? '40,180 100,140 160,96 220,96 280,60 322,48'
      : '40,180 100,140 160,146 220,96 280,105 322,65';
  }
  getTripOptions(): TripOption[] {
    return EXAMPLE_OPTIONS.map((option) => ({
      ...option,
      steps: option.steps.map((step) => ({ ...step })),
    }));
  }
}

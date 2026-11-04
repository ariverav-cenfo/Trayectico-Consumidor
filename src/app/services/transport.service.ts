import { Injectable } from '@angular/core';
import { DEMO_ROUTES, DEMO_ALERTS, DEMO_STOPS } from '../data/demo-data';
import { EXAMPLE_OPTIONS } from '../data/demo-trip-options';
import type { ValorFiltrosAvisos } from '../interfaces/valor-filtros-avisos';
import type { ValorControlesRuta } from '../interfaces/valor-controles-ruta';
import type { Ruta } from '../interfaces/ruta';
import type { ParadaRuta } from '../interfaces/parada-ruta';
import type { Aviso } from '../interfaces/aviso';
import type { TripOption } from '../interfaces/trip-option';

/** Data access for the demo. Components do not import the fixtures directly. */
@Injectable({ providedIn: 'root' })
export class TransportService {
  getRoutes(query = ''): Ruta[] {
    const term = query.trim().toLocaleLowerCase('es');
    return DEMO_ROUTES.filter((route) =>
      `${route.id} ${route.name}`.toLocaleLowerCase('es').includes(term),
    ).map((route) => ({ ...route }));
  }
  getRoute(id: string | null): Ruta | undefined {
    return this.getRoutes().find((route) => route.id === id);
  }
  getAlerts(filters?: ValorFiltrosAvisos): Aviso[] {
    return DEMO_ALERTS.filter(
      (alert) =>
        !filters ||
        ((!filters.route || alert.routeId === filters.route) &&
          (!filters.type || alert.type === filters.type)),
    ).map((alert) => ({ ...alert }));
  }
  getActiveAlert(routeId: string | null): Aviso | undefined {
    return this.getAlerts().find((alert) => !alert.resolved && alert.routeId === routeId);
  }
  getStops(controls: ValorControlesRuta): ParadaRuta[] {
    const stops = (controls.branch === 'alterno' ? DEMO_STOPS.slice(0, 6) : DEMO_STOPS).map(
      (stop) => ({ ...stop }),
    );
    return controls.direction === 'Regreso' ? stops.reverse() : stops;
  }
  getMapPoints(controls: ValorControlesRuta): string {
    return controls.branch === 'alterno'
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

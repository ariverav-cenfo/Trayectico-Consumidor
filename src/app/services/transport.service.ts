import { Injectable } from '@angular/core';
import { DEMO_ROUTES, DEMO_ALERTS, DEMO_STOPS } from '../data/demo-data';
import { EXAMPLE_OPTIONS } from '../data/demo-trip-options';
import type { AlertFiltersValue } from '../interfaces/alert-filters.interface';
import type { RouteControlsValue } from '../interfaces/route-controls.interface';
import type { RouteData } from '../interfaces/route.interface';
import type { RouteStop } from '../interfaces/route-stop.interface';
import type { ServiceAlertData } from '../interfaces/service-alert.interface';
import type { TripOption } from '../interfaces/trip-option.interface';

/** Data access for the demo. Components do not import the fixtures directly. */
@Injectable({ providedIn: 'root' })
export class TransportService {
  getRoutes(query = ''): RouteData[] {
    const term = query.trim().toLocaleLowerCase('es');
    return DEMO_ROUTES.filter((route) =>
      `${route.id} ${route.name}`.toLocaleLowerCase('es').includes(term),
    ).map((route) => ({ ...route }));
  }
  getRoute(id: string | null): RouteData | undefined {
    return this.getRoutes().find((route) => route.id === id);
  }
  getAlerts(filters?: AlertFiltersValue): ServiceAlertData[] {
    return DEMO_ALERTS.filter(
      (alert) =>
        !filters ||
        ((!filters.route || alert.routeId === filters.route) &&
          (!filters.type || alert.type === filters.type)),
    ).map((alert) => ({ ...alert }));
  }
  getActiveAlert(routeId: string | null): ServiceAlertData | undefined {
    return this.getAlerts().find((alert) => !alert.resolved && alert.routeId === routeId);
  }
  getStops(controls: RouteControlsValue): RouteStop[] {
    const stops = (controls.branch === 'alterno' ? DEMO_STOPS.slice(0, 6) : DEMO_STOPS).map(
      (stop) => ({ ...stop }),
    );
    return controls.direction === 'Regreso' ? stops.reverse() : stops;
  }
  getMapPoints(controls: RouteControlsValue): string {
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

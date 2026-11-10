import { Injectable, signal } from '@angular/core';
import type { BusquedaReciente } from '../interfaces/busqueda-reciente';
const STORAGE_KEY = 'trayectico-recent-searches';

/** Guarda las últimas cinco búsquedas del planificador en el navegador. */
@Injectable({ providedIn: 'root' })
export class BusquedasRecientesService {
  private readonly state = signal<BusquedaReciente[]>(this.load());
  /** Búsquedas recientes, de la más nueva a la más antigua. */
  readonly searches = this.state.asReadonly();
  /**
   * Guarda una búsqueda al inicio de la lista, sin repetir el mismo origen y destino.
   * Mantiene solo las cinco más recientes.
   * @param search Origen y destino buscados.
   */
  guardar(search: BusquedaReciente): void {
    const recent = [
      { ...search },
      ...this.searches().filter(
        (item) => item.origin !== search.origin || item.destination !== search.destination,
      ),
    ].slice(0, 5);
    this.state.set(recent);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recent));
    } catch {
      /* Si el navegador no permite guardar, la búsqueda sigue disponible en esta sesión. */
    }
  }
  private load(): BusquedaReciente[] {
    try {
      const stored: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
      return Array.isArray(stored)
        ? stored
            .filter(
              (item): item is BusquedaReciente =>
                !!item && typeof item.origin === 'string' && typeof item.destination === 'string',
            )
            .slice(0, 5)
        : [];
    } catch {
      return [];
    }
  }
}

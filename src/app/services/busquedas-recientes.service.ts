import { Injectable, signal } from '@angular/core';
import type { BusquedaReciente } from '../interfaces/busqueda-reciente';
const STORAGE_KEY = 'trayectico-recent-searches';
@Injectable({ providedIn: 'root' })
export class BusquedasRecientesService {
  private readonly state = signal<BusquedaReciente[]>(this.load());
  readonly searches = this.state.asReadonly();
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
      /* Keep the current session usable without browser storage. */
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

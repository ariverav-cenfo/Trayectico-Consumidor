import { HISTORIAL_DEMO } from '../data/historial-demo';
import type { ViajeGuardado } from '../interfaces/viaje-guardado';
import { Injectable, signal } from '@angular/core';
const STORAGE_KEY = 'trayectico-trip-history';

/** Historial de viajes guardados en el navegador; empieza con viajes de ejemplo. */
@Injectable({ providedIn: 'root' })
export class HistorialViajesService {
  private readonly state = signal<ViajeGuardado[]>(this.load());
  /** Viajes guardados, del más reciente al más antiguo. */
  readonly trips = this.state.asReadonly();
  /**
   * Guarda un viaje al inicio del historial. Mantiene como máximo 100 viajes.
   * @param origin Lugar de origen.
   * @param destination Lugar de destino.
   * @param option Opción elegida: `'direct'` o `'transfer'`.
   * @returns El identificador del viaje guardado.
   */
  guardar(origin: string, destination: string, option: string): string {
    const trip: ViajeGuardado = {
      id: crypto.randomUUID(),
      origin,
      destination,
      option,
      summary: option === 'transfer' ? 'Ruta [código] + Ruta [código]' : 'Ruta 0002',
      price: '₡ 000',
      savedAt: new Date().toISOString(),
    };
    this.commit([trip, ...this.trips()].slice(0, 100));
    return trip.id;
  }
  /**
   * Cambia la opción elegida de un viaje guardado.
   * @param id Identificador del viaje.
   * @param option Nueva opción: `'direct'` o `'transfer'`.
   */
  actualizarOpcion(id: string, option: string) {
    this.commit(
      this.trips().map((trip) =>
        trip.id === id
          ? {
              ...trip,
              option,
              summary: option === 'transfer' ? 'Ruta [código] + Ruta [código]' : 'Ruta 0002',
            }
          : trip,
      ),
    );
  }
  /**
   * Borra un viaje del historial.
   * @param id Identificador del viaje.
   */
  eliminar(id: string) {
    this.commit(this.trips().filter((trip) => trip.id !== id));
  }
  /** Borra todo el historial. */
  limpiar() {
    this.commit([]);
  }
  private commit(trips: ViajeGuardado[]) {
    this.state.set(trips);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
    } catch {
      /* Si el navegador no permite guardar, el historial se mantiene en memoria. */
    }
  }
  private load(): ViajeGuardado[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw === null) return HISTORIAL_DEMO.map((trip) => ({ ...trip }));
      const data: unknown = JSON.parse(raw);
      return Array.isArray(data)
        ? data
            .filter(
              (trip): trip is ViajeGuardado =>
                !!trip &&
                typeof trip.id === 'string' &&
                typeof trip.origin === 'string' &&
                typeof trip.destination === 'string' &&
                (trip.option === 'direct' || trip.option === 'transfer') &&
                typeof trip.summary === 'string' &&
                (trip.price === null || typeof trip.price === 'string') &&
                (trip.savedAt === null ||
                  (typeof trip.savedAt === 'string' && !Number.isNaN(Date.parse(trip.savedAt)))),
            )
            .slice(0, 100)
        : [];
    } catch {
      return [];
    }
  }
}

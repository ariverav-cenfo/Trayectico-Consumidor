import { Injectable, signal } from '@angular/core';
import type { BusquedaReciente } from '../interfaces/busqueda-reciente';
import type { Coordenada } from '../interfaces/lugar';
import type { SolicitudViaje } from '../interfaces/solicitud-viaje';
const STORAGE_KEY = 'trayectico-recent-searches';

/** Indica si el valor es una coordenada con latitud (-90 a 90) y longitud (-180 a 180) finitas. */
function esCoordenada(valor: unknown): valor is Coordenada {
  if (typeof valor !== 'object' || valor === null) {
    return false;
  }
  const { lat, lon } = valor as Record<string, unknown>;
  return (
    typeof lat === 'number' &&
    typeof lon === 'number' &&
    Number.isFinite(lat) &&
    Number.isFinite(lon) &&
    lat >= -90 &&
    lat <= 90 &&
    lon >= -180 &&
    lon <= 180
  );
}

/** Indica si el valor trae coordenadas válidas de origen y destino. */
function esSolicitudViaje(valor: unknown): valor is SolicitudViaje {
  if (typeof valor !== 'object' || valor === null) {
    return false;
  }
  const { origen, destino } = valor as Record<string, unknown>;
  return esCoordenada(origen) && esCoordenada(destino);
}

/**
 * Convierte un elemento guardado en una búsqueda, o null si no sirve.
 * Si las coordenadas guardadas están dañadas, conserva solo los nombres.
 */
function aBusqueda(item: unknown): BusquedaReciente | null {
  if (typeof item !== 'object' || item === null) {
    return null;
  }
  const { origin, destination, coordenadas } = item as Record<string, unknown>;
  if (typeof origin !== 'string' || typeof destination !== 'string') {
    return null;
  }
  return esSolicitudViaje(coordenadas)
    ? { origin, destination, coordenadas }
    : { origin, destination };
}

/** Guarda las últimas cinco búsquedas del planificador en el navegador. */
@Injectable({ providedIn: 'root' })
export class BusquedasRecientesService {
  private readonly state = signal<BusquedaReciente[]>(this.load());
  /** Búsquedas recientes, de la más nueva a la más antigua. */
  readonly searches = this.state.asReadonly();
  /**
   * Guarda una búsqueda al inicio de la lista, sin repetir el mismo origen y destino.
   * Mantiene solo las cinco más recientes.
   * @param search Origen y destino buscados, con sus coordenadas.
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
          .map(aBusqueda)
          .filter((item): item is BusquedaReciente => item !== null)
          .slice(0, 5)
        : [];
    } catch {
      return [];
    }
  }
}

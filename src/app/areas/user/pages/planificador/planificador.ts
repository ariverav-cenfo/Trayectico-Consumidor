import { BusquedasRecientesService } from '../../../../services/busquedas-recientes.service';
import type { BusquedaReciente } from '../../../../interfaces/busqueda-reciente';
import type { SolicitudViaje } from '../../../../interfaces/solicitud-viaje';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { OrigenDestino } from '../../components/planificador/origen-destino/origen-destino';
import { BusquedasRecientes } from '../../components/planificador/busquedas-recientes/busquedas-recientes';

import { HistorialViajesService } from '../../../../services/historial-viajes.service';
import { AiMessage } from '../../../../shared/ui/ai-message/ai-message';

/** Lee un número de los query params; null si no viene o no es un número. */
function numeroDe(params: ParamMap, nombre: string): number | null {
  const texto = params.get(nombre);
  if (texto === null || texto.trim() === '') {
    return null;
  }
  const valor = Number(texto);
  return Number.isFinite(valor) ? valor : null;
}

/** Arma las coordenadas del viaje desde los query params, solo si vienen las cuatro. */
function coordenadasDe(params: ParamMap): SolicitudViaje | null {
  const origenLat = numeroDe(params, 'origen_lat');
  const origenLon = numeroDe(params, 'origen_lon');
  const destinoLat = numeroDe(params, 'destino_lat');
  const destinoLon = numeroDe(params, 'destino_lon');
  if (origenLat === null || origenLon === null || destinoLat === null || destinoLon === null) {
    return null;
  }
  return {
    origen: { lat: origenLat, lon: origenLon },
    destino: { lat: destinoLat, lon: destinoLon },
  };
}

@Component({
  imports: [OrigenDestino, BusquedasRecientes, AiMessage],
  selector: 'app-planificador',
  styleUrl: './planificador.css',
  templateUrl: './planificador.html',
})
export class Planificador {
  private readonly router = inject(Router);
  private readonly history = inject(HistorialViajesService);
  private readonly route = inject(ActivatedRoute);
  private readonly recentSearches = inject(BusquedasRecientesService);
  protected readonly searches = this.recentSearches.searches;
  protected readonly selected = signal<BusquedaReciente | null>(this.initialSearch());
  protected select(search: BusquedaReciente) {
    this.selected.set({ ...search });
  }
  protected search(search: BusquedaReciente) {
    this.selected.set(search);
    this.recentSearches.guardar(search);
    this.showResults();
  }
  /**
   * Abre los resultados. Las coordenadas viajan en los query params
   * (origen_lat, origen_lon, destino_lat, destino_lon) para el cálculo del viaje (SCRUM-82).
   */
  protected showResults() {
    const search = this.selected();
    if (search) {
      const { origin, destination, coordenadas } = search;
      const tripId = this.history.guardar(origin, destination, 'direct');
      void this.router.navigate(['/planificar/resultado'], {
        queryParams: {
          origin,
          destination,
          tripId,
          ...(coordenadas && {
            origen_lat: coordenadas.origen.lat,
            origen_lon: coordenadas.origen.lon,
            destino_lat: coordenadas.destino.lat,
            destino_lon: coordenadas.destino.lon,
          }),
        },
      });
    }
  }
  private initialSearch(): BusquedaReciente | null {
    const params = this.route.snapshot.queryParamMap;
    const origin = params.get('origin');
    const destination = params.get('destination');
    if (!origin || !destination) {
      return null;
    }
    const coordenadas = coordenadasDe(params);
    return coordenadas ? { origin, destination, coordenadas } : { origin, destination };
  }
}

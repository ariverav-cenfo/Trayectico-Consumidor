import { BusquedasRecientesService } from '../../../../services/busquedas-recientes.service';
import type { BusquedaReciente } from '../../../../interfaces/busqueda-reciente';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrigenDestino } from '../../components/planificador/origen-destino/origen-destino';
import { BusquedasRecientes } from '../../components/planificador/busquedas-recientes/busquedas-recientes';

import { HistorialViajesService } from '../../../../services/historial-viajes.service';
import { AiMessage } from '../../../../shared/ui/ai-message/ai-message';

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
  protected showResults() {
    const search = this.selected();
    if (search) {
      const tripId = this.history.guardar(search.origin, search.destination, 'direct');
      void this.router.navigate(['/planificar/resultado'], { queryParams: { ...search, tripId } });
    }
  }
  private initialSearch(): BusquedaReciente | null {
    const params = this.route.snapshot.queryParamMap;
    const origin = params.get('origin');
    const destination = params.get('destination');
    return origin && destination ? { origin, destination } : null;
  }
}

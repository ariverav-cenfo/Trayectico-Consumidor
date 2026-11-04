import { BusquedasRecientesService } from '../../../../services/busquedas-recientes.service';
import type { BusquedaReciente } from '../../../../interfaces/busqueda-reciente';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OriginDestination } from '../../components/planner/origin-destination/origin-destination';
import { RecentSearches } from '../../components/planner/recent-searches/recent-searches';

import { HistorialViajesService } from '../../../../services/historial-viajes.service';
import { AiMessage } from '../../../../shared/ui/ai-message/ai-message';

@Component({
  imports: [OriginDestination, RecentSearches, AiMessage],
  selector: 'app-planner',
  styleUrl: './planner.css',
  templateUrl: './planner.html',
})
export class Planner {
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

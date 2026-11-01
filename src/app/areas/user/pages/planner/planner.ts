import { RecentSearchesService } from '../../../../services/recent-searches.service';
import type { RecentSearch } from '../../../../interfaces/recent-search.interface';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OriginDestination } from '../../components/planner/origin-destination/origin-destination';
import { RecentSearches } from '../../components/planner/recent-searches/recent-searches';

import { TripHistoryService } from '../../../../services/trip-history.service';
import { AiMessage } from '../../../../shared/ui/ai-message/ai-message';

@Component({
  imports: [OriginDestination, RecentSearches, AiMessage],
  selector: 'app-planner',
  styleUrl: './planner.css',
  templateUrl: './planner.html',
})
export class Planner {
  private readonly router = inject(Router);
  private readonly history = inject(TripHistoryService);
  private readonly route = inject(ActivatedRoute);
  private readonly recentSearches = inject(RecentSearchesService);
  protected readonly searches = this.recentSearches.searches;
  protected readonly selected = signal<RecentSearch | null>(this.initialSearch());
  protected select(search: RecentSearch) {
    this.selected.set({ ...search });
  }
  protected search(search: RecentSearch) {
    this.selected.set(search);
    this.recentSearches.save(search);
    this.showResults();
  }
  protected showResults() {
    const search = this.selected();
    if (search) {
      const tripId = this.history.save(search.origin, search.destination, 'direct');
      void this.router.navigate(['/planificar/resultado'], { queryParams: { ...search, tripId } });
    }
  }
  private initialSearch(): RecentSearch | null {
    const params = this.route.snapshot.queryParamMap;
    const origin = params.get('origin');
    const destination = params.get('destination');
    return origin && destination ? { origin, destination } : null;
  }
}

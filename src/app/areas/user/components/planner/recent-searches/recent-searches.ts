import type { BusquedaReciente } from '../../../../../interfaces/busqueda-reciente';
import { Component, input, output } from '@angular/core';
import { RecentSearchItem } from '../recent-search-item/recent-search-item';

@Component({
  selector: 'app-recent-searches',
  imports: [RecentSearchItem],
  templateUrl: './recent-searches.html',
  styleUrl: './recent-searches.css',
})
export class RecentSearches {
  readonly searches = input<BusquedaReciente[]>([]);
  readonly selected = input<BusquedaReciente | null>(null);
  readonly choose = output<BusquedaReciente>();
}

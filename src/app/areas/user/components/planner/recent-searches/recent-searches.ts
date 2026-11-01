import type { RecentSearch } from '../../../../../interfaces/recent-search.interface';
import { Component, input, output } from '@angular/core';
import { RecentSearchItem } from '../recent-search-item/recent-search-item';

@Component({
  selector: 'app-recent-searches',
  imports: [RecentSearchItem],
  templateUrl: './recent-searches.html',
  styleUrl: './recent-searches.css',
})
export class RecentSearches {
  readonly searches = input<RecentSearch[]>([]);
  readonly selected = input<RecentSearch | null>(null);
  readonly choose = output<RecentSearch>();
}

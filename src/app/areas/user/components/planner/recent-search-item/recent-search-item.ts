import type { RecentSearch } from '../../../../../interfaces/recent-search.interface';
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-recent-search-item',
  templateUrl: './recent-search-item.html',
  styleUrl: './recent-search-item.css',
})
export class RecentSearchItem {
  readonly search = input.required<RecentSearch>();
  readonly selected = input(false);
  readonly choose = output<RecentSearch>();
}

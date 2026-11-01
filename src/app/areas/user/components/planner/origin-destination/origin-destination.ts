import type { RecentSearch } from '../../../../../interfaces/recent-search.interface';
import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-origin-destination',
  imports: [FormsModule],
  templateUrl: './origin-destination.html',
  styleUrl: './origin-destination.css',
})
export class OriginDestination {
  readonly initialSearch = input<RecentSearch | null>(null);
  readonly search = output<RecentSearch>();
  protected origin = '';
  protected destination = '';
  ngOnChanges() {
    const selected = this.initialSearch();
    if (selected) {
      this.origin = selected.origin;
      this.destination = selected.destination;
    }
  }
  protected swap() {
    [this.origin, this.destination] = [this.destination, this.origin];
  }
  protected submit() {
    const origin = this.origin.trim();
    const destination = this.destination.trim();
    if (origin && destination) this.search.emit({ origin, destination });
  }
}

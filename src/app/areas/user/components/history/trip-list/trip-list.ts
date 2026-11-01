import type { SavedTrip } from '../../../../../interfaces/saved-trip.interface';
import { Button } from '../../../../../shared/ui/button/button';
import { Component, input, output, signal, computed } from '@angular/core';

import { TripCard } from '../trip-card/trip-card';
@Component({
  selector: 'app-trip-list',
  imports: [Button, TripCard],
  templateUrl: './trip-list.html',
  styles: ':host { display: block; }',
})
export class TripList {
  readonly trips = input.required<SavedTrip[]>();
  readonly remove = output<string>();
  protected readonly limit = signal(3);
  protected readonly visible = computed(() => this.trips().slice(0, this.limit()));
  protected loadMore() {
    this.limit.update((n) => n + 3);
  }
}

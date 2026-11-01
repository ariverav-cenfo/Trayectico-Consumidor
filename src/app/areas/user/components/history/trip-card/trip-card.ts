import type { SavedTrip } from '../../../../../interfaces/saved-trip.interface';
import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { UiIcon } from '../../../../../shared/ui/ui-icon/ui-icon';
@Component({
  selector: 'app-trip-card',
  imports: [DatePipe, RouterLink, UiIcon],
  templateUrl: './trip-card.html',
  styles: ':host { display: block; }',
})
export class TripCard {
  readonly trip = input.required<SavedTrip>();
  readonly remove = output<string>();
}


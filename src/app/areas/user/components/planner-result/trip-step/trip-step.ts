import type { TripStepData } from '../../../../../interfaces/trip-option';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-trip-step',
  templateUrl: './trip-step.html',
  styleUrl: './trip-step.css',
})
export class TripStep {
  readonly step = input.required<TripStepData>();
  readonly number = input.required<number>();
}

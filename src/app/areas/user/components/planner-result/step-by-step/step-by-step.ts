import type { TripStepData } from '../../../../../interfaces/trip-option.interface';
import { Component, input } from '@angular/core';
import { TripStep } from '../trip-step/trip-step';

@Component({
  selector: 'app-step-by-step',
  imports: [TripStep],
  templateUrl: './step-by-step.html',
  styleUrl: './step-by-step.css',
})
export class StepByStep {
  readonly steps = input.required<TripStepData[]>();
}

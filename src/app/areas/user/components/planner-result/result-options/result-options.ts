import type { TripOption } from '../../../../../interfaces/trip-option.interface';
import { Component, input, output } from '@angular/core';

@Component({ selector: 'app-result-options', templateUrl: './result-options.html', styleUrl: './result-options.css' })
export class ResultOptions {
  readonly option = input.required<TripOption>();
  readonly selected = input(false);
  readonly choose = output<TripOption>();
}

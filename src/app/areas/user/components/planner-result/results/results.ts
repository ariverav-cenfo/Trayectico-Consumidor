import type { TripOption } from '../../../../../interfaces/trip-option';
import { Component, input, output } from '@angular/core';
import { ResultOptions } from '../result-options/result-options';


@Component({ selector: 'app-results', imports: [ResultOptions], templateUrl: './results.html', styleUrl: './results.css' })
export class Results {
  readonly options = input.required<TripOption[]>();
  readonly selectedId = input.required<string>();
  readonly choose = output<TripOption>();
}

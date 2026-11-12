import type { TripStepData } from '../../../../../interfaces/trip-option';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-paso-viaje',
  templateUrl: './paso-viaje.html',
  styleUrl: './paso-viaje.css',
})
export class PasoViaje {
  readonly step = input.required<TripStepData>();
  readonly number = input.required<number>();
}

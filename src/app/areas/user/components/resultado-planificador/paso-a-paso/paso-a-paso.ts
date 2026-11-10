import type { TripStepData } from '../../../../../interfaces/trip-option';
import { Component, input } from '@angular/core';
import { PasoViaje } from '../paso-viaje/paso-viaje';

@Component({
  selector: 'app-paso-a-paso',
  imports: [PasoViaje],
  templateUrl: './paso-a-paso.html',
  styleUrl: './paso-a-paso.css',
})
export class PasoAPaso {
  readonly steps = input.required<TripStepData[]>();
}

import type { TripOption } from '../../../../../interfaces/trip-option';
import { Component, input, output } from '@angular/core';

@Component({ selector: 'app-opciones-resultado', templateUrl: './opciones-resultado.html', styleUrl: './opciones-resultado.css' })
export class OpcionesResultado {
  readonly option = input.required<TripOption>();
  readonly selected = input(false);
  readonly choose = output<TripOption>();
}

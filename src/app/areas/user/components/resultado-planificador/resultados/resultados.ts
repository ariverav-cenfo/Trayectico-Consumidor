import type { TripOption } from '../../../../../interfaces/trip-option';
import { Component, input, output } from '@angular/core';
import { OpcionesResultado } from '../opciones-resultado/opciones-resultado';


@Component({ selector: 'app-resultados', imports: [OpcionesResultado], templateUrl: './resultados.html', styleUrl: './resultados.css' })
export class Resultados {
  readonly options = input.required<TripOption[]>();
  readonly selectedId = input.required<string>();
  readonly choose = output<TripOption>();
}

import type { OpcionesViajeResponseDTO } from '../../../../../interfaces/api-calculo-viaje';
import { Component, input, output } from '@angular/core';

@Component({ selector: 'app-opciones-resultado', templateUrl: 
  './opciones-resultado.html', 
  styleUrl: './opciones-resultado.css' })
export class OpcionesResultado {
  readonly option = input.required<OpcionesViajeResponseDTO>();
  readonly selected = input(false);
  readonly choose = output<OpcionesViajeResponseDTO>();
}

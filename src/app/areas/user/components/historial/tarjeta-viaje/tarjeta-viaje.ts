import type { ViajeGuardado } from '../../../../../interfaces/viaje-guardado';
import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { UiIcon } from '../../../../../shared/ui/ui-icon/ui-icon';
@Component({
  selector: 'app-tarjeta-viaje',
  imports: [DatePipe, RouterLink, UiIcon],
  templateUrl: './tarjeta-viaje.html',
  styles: ':host { display: block; }',
})
export class TarjetaViaje {
  readonly trip = input.required<ViajeGuardado>();
  readonly remove = output<string>();
}


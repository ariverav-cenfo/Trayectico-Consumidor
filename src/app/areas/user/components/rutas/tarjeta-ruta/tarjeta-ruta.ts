import type { Ruta } from '../../../../../interfaces/ruta';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { UiIcon } from '../../../../../shared/ui/ui-icon/ui-icon';
@Component({
  selector: 'app-tarjeta-ruta',
  imports: [RouterLink, UiIcon],
  templateUrl: './tarjeta-ruta.html',
  styles: ':host { display: block; }',
})
export class TarjetaRuta {
  readonly route = input.required<Ruta>();
}


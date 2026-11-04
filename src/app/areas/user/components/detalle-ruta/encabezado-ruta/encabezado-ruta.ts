import type { Ruta } from '../../../../../interfaces/ruta';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UiIcon } from '../../../../../shared/ui/ui-icon/ui-icon';

@Component({
  selector: 'app-encabezado-ruta',
  imports: [RouterLink, UiIcon],
  templateUrl: './encabezado-ruta.html',
  styles: ':host { display: block; }',
})
export class EncabezadoRuta {
  readonly route = input.required<Ruta>();
}


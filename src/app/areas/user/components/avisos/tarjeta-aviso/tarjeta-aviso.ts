import type { Aviso } from '../../../../../interfaces/aviso';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { UiIcon } from '../../../../../shared/ui/ui-icon/ui-icon';
@Component({
  selector: 'app-tarjeta-aviso',
  imports: [RouterLink, UiIcon],
  templateUrl: './tarjeta-aviso.html',
  styles: ':host { display: block; }',
})
export class TarjetaAviso {
  readonly alert = input.required<Aviso>();
}


import type { Aviso } from '../../../../../interfaces/aviso';
import { Component, input } from '@angular/core';

import { UiIcon } from '../../../../../shared/ui/ui-icon/ui-icon';
@Component({
  selector: 'app-aviso-ruta',
  imports: [UiIcon],
  templateUrl: './aviso-ruta.html',
  styles: ':host { display: block; }',
})
export class AvisoRuta {
  readonly alert = input.required<Aviso>();
}


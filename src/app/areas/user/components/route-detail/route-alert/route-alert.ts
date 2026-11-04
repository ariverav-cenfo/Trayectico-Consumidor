import type { Aviso } from '../../../../../interfaces/aviso';
import { Component, input } from '@angular/core';

import { UiIcon } from '../../../../../shared/ui/ui-icon/ui-icon';
@Component({
  selector: 'app-route-alert',
  imports: [UiIcon],
  templateUrl: './route-alert.html',
  styles: ':host { display: block; }',
})
export class RouteAlert {
  readonly alert = input.required<Aviso>();
}


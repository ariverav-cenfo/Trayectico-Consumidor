import type { Aviso } from '../../../../../interfaces/aviso';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { UiIcon } from '../../../../../shared/ui/ui-icon/ui-icon';
@Component({
  selector: 'app-alert-card',
  imports: [RouterLink, UiIcon],
  templateUrl: './alert-card.html',
  styles: ':host { display: block; }',
})
export class AlertCard {
  readonly alert = input.required<Aviso>();
}


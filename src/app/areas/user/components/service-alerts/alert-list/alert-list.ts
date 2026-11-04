import type { Aviso } from '../../../../../interfaces/aviso';
import { Component, input } from '@angular/core';

import { AlertCard } from '../alert-card/alert-card';
@Component({
  selector: 'app-alert-list',
  imports: [AlertCard],
  templateUrl: './alert-list.html',
  styles: ':host { display: block; }',
})
export class AlertList {
  readonly alerts = input.required<Aviso[]>();
}


import type { RouteData } from '../../../../../interfaces/route.interface';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { UiIcon } from '../../../../../shared/ui/ui-icon/ui-icon';
@Component({
  selector: 'app-route-card',
  imports: [RouterLink, UiIcon],
  templateUrl: './route-card.html',
  styles: ':host { display: block; }',
})
export class RouteCard {
  readonly route = input.required<RouteData>();
}


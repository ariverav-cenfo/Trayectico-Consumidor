import type { RouteData } from '../../../../../interfaces/route.interface';
import { Component, input } from '@angular/core';

import { PaymentMethod } from '../../../../../shared/ui/payment-method/payment-method';
@Component({
  selector: 'app-route-fares',
  imports: [PaymentMethod],
  templateUrl: './route-fares.html',
  styles: ':host { display: block; }',
})
export class RouteFares {
  readonly route = input.required<RouteData>();
}


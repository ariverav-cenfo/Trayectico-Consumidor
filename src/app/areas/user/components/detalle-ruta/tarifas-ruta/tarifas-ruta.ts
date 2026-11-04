import type { Ruta } from '../../../../../interfaces/ruta';
import { Component, input } from '@angular/core';

import { PaymentMethod } from '../../../../../shared/ui/payment-method/payment-method';
@Component({
  selector: 'app-tarifas-ruta',
  imports: [PaymentMethod],
  templateUrl: './tarifas-ruta.html',
  styles: ':host { display: block; }',
})
export class TarifasRuta {
  readonly route = input.required<Ruta>();
}


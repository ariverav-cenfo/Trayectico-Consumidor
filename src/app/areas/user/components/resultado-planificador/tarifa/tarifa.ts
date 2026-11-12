import { Component, input } from '@angular/core';
import { PaymentMethod } from '../../../../../shared/ui/payment-method/payment-method';
@Component({
  selector: 'app-tarifa',
  imports: [PaymentMethod],
  templateUrl: './tarifa.html',
  styleUrl: './tarifa.css',
})
export class Tarifa {
  readonly price = input.required<string>();
  readonly payment = input.required<string>();
  readonly updatedAt = input('[fecha]');
}

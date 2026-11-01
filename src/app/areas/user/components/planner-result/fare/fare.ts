import { Component, input } from '@angular/core';
import { PaymentMethod } from '../../../../../shared/ui/payment-method/payment-method';
@Component({
  selector: 'app-fare',
  imports: [PaymentMethod],
  templateUrl: './fare.html',
  styleUrl: './fare.css',
})
export class Fare {
  readonly price = input.required<string>();
  readonly payment = input.required<string>();
  readonly updatedAt = input('[fecha]');
}

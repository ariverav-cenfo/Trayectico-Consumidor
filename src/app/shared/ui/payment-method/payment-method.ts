import { Component, input } from '@angular/core';
import { UiIcon } from '../ui-icon/ui-icon';
@Component({
  selector: 'app-payment-method',
  imports: [UiIcon],
  templateUrl: './payment-method.html',
  styleUrl: './payment-method.css',
})
export class PaymentMethod {
  readonly method = input.required<string>();
}

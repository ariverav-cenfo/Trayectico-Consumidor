import type { ButtonSize, ButtonVariant } from '../../../interfaces/button.interface';
import { Component, input } from '@angular/core';

/** Native buttons and links retain their click, disabled, form and router behavior. */
@Component({
  selector: 'button[appButton], a[appButton]',
  host: {
    class: 'ui-button',
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
    '[class.full-width]': 'fullWidth()',
  },
  template: `@if (text()) {
      {{ text() }}
    }
    <ng-content />`,
  styleUrl: './button.css',
})
export class Button {
  readonly text = input('');
  readonly size = input<ButtonSize>('large');
  readonly variant = input<ButtonVariant>('secondary');
  readonly fullWidth = input(true);
}

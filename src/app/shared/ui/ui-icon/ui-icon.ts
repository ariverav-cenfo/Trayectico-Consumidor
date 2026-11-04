import type { IconPaths } from '../../../interfaces/ui-icon';
import { Component, input } from '@angular/core';
@Component({
  selector: 'app-ui-icon',
  template: `<svg viewBox="0 0 24 24" aria-hidden="true">
    <path [attr.d]="paths[name()] || paths['info']" />
  </svg>`,
  styles: `
    :host {
      display: inline-flex;
      flex-shrink: 0;
      width: 1.35em;
      height: 1.35em;
      vertical-align: middle;
      font-size: 32px;
    }
    @media (max-width: 600px) {
      :host {
        font-size: 22px;
      }
    }
    svg {
      width: 100%;
      height: 100%;
      fill: none;
      stroke: currentColor;
      stroke-width: 1.8;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
  `,
})
export class UiIcon {
  readonly name = input('info');
  protected readonly paths: IconPaths = {
    info: 'M21 12A9 9 0 1 1 3 12 9 9 0 1 1 21 12M12 11V17M12 7H12.01',
    cash: 'M2 5H22V19H2ZM14 12A2 2 0 1 1 10 12 2 2 0 1 1 14 12',
    card: 'M2 9H22M2 4H22V20H2Z',
    warning: 'M12 3 23 21H1ZM12 9V14M12 18H12.01',
    chevron: 'M9 4 17 12 9 20',
    back: 'M15 4 7 12 15 20',
    check: 'M3 12 9 18 21 5',
    trash: 'M3 5H21M9 5V2H15V5M5 5 6 22H18L19 5',
    logout: 'M9 3H4V21H9M10 12H22M16 6 22 12 16 18',
    blocked: 'M21 12A9 9 0 1 1 3 12 9 9 0 1 1 21 12M6 6 18 18',
  };
}

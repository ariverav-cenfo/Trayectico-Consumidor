import { Component } from '@angular/core';
import { UiIcon } from '../../../../../shared/ui/ui-icon/ui-icon';
@Component({
  selector: 'app-nota-asistente',
  imports: [UiIcon],
  template: `<aside>
    <app-ui-icon name="info" />
    <p>
      El asistente solo hace acciones que usted también puede hacer desde las pantallas. Siempre le
      pedirá confirmación antes de guardar o cambiar datos.
    </p>
  </aside>`,
  styles: `
    aside {
      display: flex;
      gap: 22px;
      padding: 24px 32px;
      border-bottom: 2px solid #c7d5d0;
    }
    app-ui-icon {
      color: #1767c9;
      margin-top: 2px;
    }
    p {
      margin: 0;
      font-size: 28px;
      line-height: 1.4;
    }
    @media (max-width: 600px) {
      aside {
        padding: 20px 16px;
        gap: 14px;
      }
      p {
        font-size: 18px;
      }
    }
  `,
})
export class NotaAsistente {}

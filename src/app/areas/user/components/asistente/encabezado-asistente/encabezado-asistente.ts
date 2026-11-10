import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UiIcon } from '../../../../../shared/ui/ui-icon/ui-icon';
@Component({
  selector: 'app-encabezado-asistente',
  imports: [RouterLink, UiIcon],
  template: `<header>
    <a routerLink="/planificar" aria-label="Volver a planificar"><app-ui-icon name="back" /></a>
    <h1>Asistente</h1>
  </header>`,
  styles: `
    header {
      display: flex;
      align-items: center;
      gap: 32px;
      background: #1c3a34;
      color: white;
      padding: 26px 32px;
      min-height: 112px;
    }
    a {
      color: white;
      display: flex;
      padding: 8px;
    }
    h1 {
      font-size: 40px;
      margin: 0;
    }
    @media (max-width: 600px) {
      header {
        min-height: 72px;
        padding: 16px;
        gap: 20px;
      }
      h1 {
        font-size: 28px;
      }
    }
  `,
})
export class EncabezadoAsistente {}

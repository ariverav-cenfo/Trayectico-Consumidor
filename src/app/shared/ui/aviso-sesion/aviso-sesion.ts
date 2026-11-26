import { Component, inject } from '@angular/core';
import { SesionService } from '../../../services/sesion.service';

/**
 * Aviso de que la sesión se cerró (con el botón, por inactividad o porque venció).
 * Se muestra en la página de inicio hasta que el usuario lo cierra o vuelve a entrar.
 */
@Component({
  selector: 'app-aviso-sesion',
  template: `
    @if (sesion.mensajeCierre(); as mensaje) {
      <div class="aviso" role="status">
        <p>{{ mensaje }}</p>
        <button type="button" aria-label="Cerrar aviso" (click)="sesion.descartarMensajeCierre()">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 5 14 14M19 5 5 19" /></svg>
        </button>
      </div>
    }
  `,
  styles: `
    :host {
      display: block;
    }
    .aviso {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 16px;
      padding: 8px 8px 8px 16px;
      border: 1px solid #1c3a34;
      border-radius: 8px;
      background: #ecf2ef;
      color: #1c3a34;
      font-weight: 700;
    }
    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 44px;
      min-height: 44px;
      border: 0;
      background: none;
      color: inherit;
      cursor: pointer;
    }
    svg {
      width: 20px;
      height: 20px;
      fill: none;
      stroke: currentColor;
      stroke-width: 2;
    }
  `,
})
export class AvisoSesion {
  protected readonly sesion = inject(SesionService);
}

import { Button } from '../button/button';
import { Component, inject } from '@angular/core';
import { UiIcon } from '../ui-icon/ui-icon';
import { SesionService } from '../../../services/sesion.service';

/**
 * Botón para cerrar la sesión. Solo se muestra si hay una sesión activa;
 * al cerrarla, el usuario vuelve al inicio con el aviso de sesión cerrada.
 */
@Component({
  selector: 'app-logout-button',
  imports: [Button, UiIcon],
  templateUrl: './logout-button.html',
  styles: ':host { display: block; }',
})
export class LogoutButton {
  protected readonly sesion = inject(SesionService);
}

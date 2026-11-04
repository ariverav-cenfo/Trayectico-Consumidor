import { Component, input } from '@angular/core';
import { UiIcon } from '../../../../../shared/ui/ui-icon/ui-icon';
@Component({
  selector: 'app-datos-perfil',
  imports: [UiIcon],
  templateUrl: './datos-perfil.html',
  styles: ':host { display: block; }',
})
export class DatosPerfil {
  readonly name = input('[Nombre de usuario]');
  readonly email = input('[correo@gmail.com]');
}


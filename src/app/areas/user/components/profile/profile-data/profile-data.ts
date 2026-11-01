import { Component, input } from '@angular/core';
import { UiIcon } from '../../../../../shared/ui/ui-icon/ui-icon';
@Component({
  selector: 'app-profile-data',
  imports: [UiIcon],
  templateUrl: './profile-data.html',
  styles: ':host { display: block; }',
})
export class ProfileData {
  readonly name = input('[Nombre de usuario]');
  readonly email = input('[correo@gmail.com]');
}


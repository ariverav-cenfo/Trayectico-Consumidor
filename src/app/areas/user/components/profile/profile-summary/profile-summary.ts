import { Component, input } from '@angular/core';

@Component({
  selector: 'app-profile-summary',
  imports: [],
  templateUrl: './profile-summary.html',
  styles: ':host { display: block; }',
})
export class ProfileSummary {
  readonly name = input('[Nombre de usuario]');
  readonly email = input('[correo@gmail.com]');
  readonly initials = input('[IN]');
}


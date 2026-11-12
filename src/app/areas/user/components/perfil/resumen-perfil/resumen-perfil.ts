import { Component, input } from '@angular/core';

@Component({
  selector: 'app-resumen-perfil',
  imports: [],
  templateUrl: './resumen-perfil.html',
  styles: ':host { display: block; }',
})
export class ResumenPerfil {
  readonly name = input('[Nombre de usuario]');
  readonly email = input('[correo@gmail.com]');
  readonly initials = input('[IN]');
}


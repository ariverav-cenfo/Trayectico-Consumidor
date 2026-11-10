import type { Aviso } from '../../../../../interfaces/aviso';
import { Component, input } from '@angular/core';

import { TarjetaAviso } from '../tarjeta-aviso/tarjeta-aviso';
@Component({
  selector: 'app-lista-avisos',
  imports: [TarjetaAviso],
  templateUrl: './lista-avisos.html',
  styles: ':host { display: block; }',
})
export class ListaAvisos {
  readonly alerts = input.required<Aviso[]>();
}


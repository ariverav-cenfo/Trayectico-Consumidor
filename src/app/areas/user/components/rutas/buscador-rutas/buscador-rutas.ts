import { Component, output } from '@angular/core';

@Component({
  selector: 'app-buscador-rutas',
  imports: [],
  templateUrl: './buscador-rutas.html',
  styles: ':host { display: block; }',
})
export class BuscadorRutas {
  readonly search = output<string>();
}


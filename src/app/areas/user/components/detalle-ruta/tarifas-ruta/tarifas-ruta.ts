import type { Ruta } from '../../../../../interfaces/ruta';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-tarifas-ruta',
  templateUrl: './tarifas-ruta.html',
  styles: ':host { display: block; }',
})
export class TarifasRuta {
  readonly route = input.required<Ruta>();
}


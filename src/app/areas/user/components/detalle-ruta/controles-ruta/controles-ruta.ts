import type { ValorControlesRuta } from '../../../../../interfaces/valor-controles-ruta';
import type { SentidoRecorrido } from '../../../../../interfaces/recorrido';
import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-controles-ruta',
  imports: [FormsModule],
  templateUrl: './controles-ruta.html',
  styles: ':host { display: block; }',
})
export class ControlesRuta {
  readonly change = output<ValorControlesRuta>();
  protected ramal = '';
  protected sentidoRecorrido: SentidoRecorrido = '1-2';
  protected emit() {
    this.change.emit({ ramal: this.ramal, sentidoRecorrido: this.sentidoRecorrido });
  }
}

import type {
  ValorControlesRuta,
  SentidoRecorrido,
} from '../../../../../interfaces/valor-controles-ruta';
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
  protected branch = '';
  protected direction: SentidoRecorrido = 'Ida';
  protected emit() {
    this.change.emit({ branch: this.branch, direction: this.direction });
  }
}

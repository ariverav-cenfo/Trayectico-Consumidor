import { Component, input, output } from '@angular/core'; // Importar input
import { FormsModule } from '@angular/forms';
import type { ValorControlesRuta } from '../../../../../interfaces/valor-controles-ruta';
import type { SentidoRecorrido } from '../../../../../interfaces/recorrido';
import type { Ruta } from '../../../../../interfaces/ruta'; // Importar la interfaz Ruta

@Component({
  selector: 'app-controles-ruta',
  imports: [FormsModule],
  templateUrl: './controles-ruta.html',
  styles: ':host { display: block; }',
})
export class ControlesRuta {
  // Recibe la ruta que le pasamos desde detalle-ruta.html
  readonly route = input<Ruta>(); 
  
  readonly change = output<ValorControlesRuta>();

  protected ramal = '';
  protected sentidoRecorrido: SentidoRecorrido = '1-2';

  protected emit() {
    this.change.emit({ ramal: this.ramal, sentidoRecorrido: this.sentidoRecorrido });
  }
}
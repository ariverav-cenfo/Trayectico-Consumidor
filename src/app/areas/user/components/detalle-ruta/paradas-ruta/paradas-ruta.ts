import type { ParadaRuta } from '../../../../../interfaces/parada-ruta';
import { Component, input, signal, computed } from '@angular/core';

@Component({
  selector: 'app-paradas-ruta',
  imports: [],
  templateUrl: './paradas-ruta.html',
  styles: ':host { display: block; }',
})
export class ParadasRuta {
  readonly stops = input.required<ParadaRuta[]>();
  protected readonly expanded = signal(false);
  protected readonly visible = computed(() =>
    this.expanded() ? this.stops() : this.stops().slice(0, 4),
  );
}


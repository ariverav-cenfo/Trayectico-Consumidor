import type { ViajeGuardado } from '../../../../../interfaces/viaje-guardado';
import { Button } from '../../../../../shared/ui/button/button';
import { Component, input, output, signal, computed } from '@angular/core';

import { TarjetaViaje } from '../tarjeta-viaje/tarjeta-viaje';
@Component({
  selector: 'app-lista-viajes',
  imports: [Button, TarjetaViaje],
  templateUrl: './lista-viajes.html',
  styles: ':host { display: block; }',
})
export class ListaViajes {
  readonly trips = input.required<ViajeGuardado[]>();
  readonly remove = output<string>();
  protected readonly limit = signal(3);
  protected readonly visible = computed(() => this.trips().slice(0, this.limit()));
  protected loadMore() {
    this.limit.update((n) => n + 3);
  }
}

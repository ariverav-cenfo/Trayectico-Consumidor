import type { BusquedaReciente } from '../../../../../interfaces/busqueda-reciente';
import { Component, input, output } from '@angular/core';
import { ItemBusquedaReciente } from '../item-busqueda-reciente/item-busqueda-reciente';

@Component({
  selector: 'app-busquedas-recientes',
  imports: [ItemBusquedaReciente],
  templateUrl: './busquedas-recientes.html',
  styleUrl: './busquedas-recientes.css',
})
export class BusquedasRecientes {
  readonly searches = input<BusquedaReciente[]>([]);
  readonly selected = input<BusquedaReciente | null>(null);
  readonly choose = output<BusquedaReciente>();
}

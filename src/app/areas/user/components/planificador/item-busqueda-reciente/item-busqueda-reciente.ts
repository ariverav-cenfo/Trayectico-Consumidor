import type { BusquedaReciente } from '../../../../../interfaces/busqueda-reciente';
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-item-busqueda-reciente',
  templateUrl: './item-busqueda-reciente.html',
  styleUrl: './item-busqueda-reciente.css',
})
export class ItemBusquedaReciente {
  readonly search = input.required<BusquedaReciente>();
  readonly selected = input(false);
  readonly choose = output<BusquedaReciente>();
}

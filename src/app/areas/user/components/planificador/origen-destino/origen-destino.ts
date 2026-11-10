import type { BusquedaReciente } from '../../../../../interfaces/busqueda-reciente';
import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-origen-destino',
  imports: [FormsModule],
  templateUrl: './origen-destino.html',
  styleUrl: './origen-destino.css',
})
export class OrigenDestino {
  readonly initialSearch = input<BusquedaReciente | null>(null);
  readonly search = output<BusquedaReciente>();
  protected origin = '';
  protected destination = '';
  ngOnChanges() {
    const selected = this.initialSearch();
    if (selected) {
      this.origin = selected.origin;
      this.destination = selected.destination;
    }
  }
  protected swap() {
    [this.origin, this.destination] = [this.destination, this.origin];
  }
  protected submit() {
    const origin = this.origin.trim();
    const destination = this.destination.trim();
    if (origin && destination) this.search.emit({ origin, destination });
  }
}

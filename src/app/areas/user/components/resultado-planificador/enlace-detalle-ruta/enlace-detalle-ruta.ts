import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-enlace-detalle-ruta',
  imports: [RouterLink],
  templateUrl: './enlace-detalle-ruta.html',
  styleUrl: './enlace-detalle-ruta.css',
})
export class EnlaceDetalleRuta {
  readonly routeId = input.required<string>();
}

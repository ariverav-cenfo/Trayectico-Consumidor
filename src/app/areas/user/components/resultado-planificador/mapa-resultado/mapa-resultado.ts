import { Component, input } from '@angular/core';
@Component({
  selector: 'app-mapa-resultado',
  templateUrl: './mapa-resultado.html',
  styleUrl: './mapa-resultado.css',
})
export class MapaResultado {
  readonly points = input.required<string>();
  protected stops() {
    return this.points()
      .split(' ')
      .map((point) => point.split(','));
  }
}

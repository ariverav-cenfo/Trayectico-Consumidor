import { Component, input } from '@angular/core';
@Component({
  selector: 'app-result-map',
  templateUrl: './result-map.html',
  styleUrl: './result-map.css',
})
export class ResultMap {
  readonly points = input.required<string>();
  protected stops() {
    return this.points()
      .split(' ')
      .map((point) => point.split(','));
  }
}

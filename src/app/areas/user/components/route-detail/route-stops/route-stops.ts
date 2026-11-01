import type { RouteStop } from '../../../../../interfaces/route-stop.interface';
import { Component, input, signal, computed } from '@angular/core';

@Component({
  selector: 'app-route-stops',
  imports: [],
  templateUrl: './route-stops.html',
  styles: ':host { display: block; }',
})
export class RouteStops {
  readonly stops = input.required<RouteStop[]>();
  protected readonly expanded = signal(false);
  protected readonly visible = computed(() =>
    this.expanded() ? this.stops() : this.stops().slice(0, 4),
  );
}


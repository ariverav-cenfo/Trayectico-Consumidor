import type { RouteData } from '../../../../../interfaces/route.interface';
import { Button } from '../../../../../shared/ui/button/button';
import { Component, input, signal, computed } from '@angular/core';

import { RouteCard } from '../route-card/route-card';
@Component({
  selector: 'app-route-list',
  imports: [Button, RouteCard],
  templateUrl: './route-list.html',
  styles: ':host { display: block; }',
})
export class RouteList {
  readonly routes = input.required<RouteData[]>();
  protected readonly limit = signal(4);

  protected readonly visible = computed(() => this.routes().slice(0, this.limit()));
  ngOnChanges() {
    this.limit.set(4);
  }
  protected loadMore() {
    this.limit.update((n) => n + 4);
  }
}

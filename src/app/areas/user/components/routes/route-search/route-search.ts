import { Component, output } from '@angular/core';

@Component({
  selector: 'app-route-search',
  imports: [],
  templateUrl: './route-search.html',
  styles: ':host { display: block; }',
})
export class RouteSearch {
  readonly search = output<string>();
}


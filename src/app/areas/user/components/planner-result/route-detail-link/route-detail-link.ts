import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-route-detail-link',
  imports: [RouterLink],
  templateUrl: './route-detail-link.html',
  styleUrl: './route-detail-link.css',
})
export class RouteDetailLink {
  readonly routeId = input.required<string>();
}

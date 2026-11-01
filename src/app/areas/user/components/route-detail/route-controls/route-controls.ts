import type {
  RouteControlsValue,
  RouteDirection,
} from '../../../../../interfaces/route-controls.interface';
import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-route-controls',
  imports: [FormsModule],
  templateUrl: './route-controls.html',
  styles: ':host { display: block; }',
})
export class RouteControls {
  readonly change = output<RouteControlsValue>();
  protected branch = '';
  protected direction: RouteDirection = 'Ida';
  protected emit() {
    this.change.emit({ branch: this.branch, direction: this.direction });
  }
}

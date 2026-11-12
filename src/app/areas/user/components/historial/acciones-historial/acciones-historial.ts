import { Button } from '../../../../../shared/ui/button/button';
import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-acciones-historial',
  imports: [Button, RouterLink],
  templateUrl: './acciones-historial.html',
  styles: ':host { display: block; }',
})
export class AccionesHistorial {
  readonly hasTrips = input(false);
  readonly clear = output<void>();
}

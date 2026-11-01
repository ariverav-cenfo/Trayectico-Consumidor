import { Button } from '../../../../../shared/ui/button/button';
import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-history-actions',
  imports: [Button, RouterLink],
  templateUrl: './history-actions.html',
  styles: ':host { display: block; }',
})
export class HistoryActions {
  readonly hasTrips = input(false);
  readonly clear = output<void>();
}

import { Component, input } from '@angular/core';

@Component({
  selector: 'app-data-footer',
  imports: [],
  templateUrl: './data-footer.html',
  styleUrl: './data-footer.css',
})
export class DataFooter {
  readonly alerts = input(false);
}

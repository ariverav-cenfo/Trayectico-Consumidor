import { Button } from '../button/button';
import { Component } from '@angular/core';
import { UiIcon } from '../ui-icon/ui-icon';
@Component({
  selector: 'app-logout-button',
  imports: [Button, UiIcon],
  templateUrl: './logout-button.html',
  styles: ':host { display: block; }',
})
export class LogoutButton {}

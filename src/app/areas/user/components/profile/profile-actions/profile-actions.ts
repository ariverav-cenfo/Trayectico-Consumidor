import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UiIcon } from '../../../../../shared/ui/ui-icon/ui-icon';
import { LogoutButton } from '../../../../../shared/ui/logout-button/logout-button';
@Component({
  selector: 'app-profile-actions',
  imports: [RouterLink, UiIcon, LogoutButton],
  templateUrl: './profile-actions.html',
  styles: ':host { display: block; }',
})
export class ProfileActions {}


import { Component } from '@angular/core';
import { LogoutButton } from '../../../../shared/ui/logout-button/logout-button';

@Component({
  imports: [LogoutButton],
  selector: 'app-admin-panel',
  styleUrl: './admin-panel.css',
  templateUrl: './admin-panel.html',
})
export class AdminPanel {}

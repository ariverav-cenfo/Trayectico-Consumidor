import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TopBar } from '../../../../shared/layout/top-bar/top-bar';

@Component({
  imports: [TopBar, RouterLink],
  selector: 'app-access-denied',
  styleUrl: './access-denied.css',
  templateUrl: './access-denied.html',
})
export class AccessDenied {}

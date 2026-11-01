import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TopBar } from '../../../../shared/layout/top-bar/top-bar';

@Component({
  imports: [TopBar, RouterLink],
  selector: 'app-not-found',
  styleUrl: './not-found.css',
  templateUrl: './not-found.html',
})
export class NotFound {}

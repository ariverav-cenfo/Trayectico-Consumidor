import { Component } from '@angular/core';
import { HeaderAuth } from '../../ui/header-auth/header-auth';

@Component({
  selector: 'app-top-bar',
  imports: [HeaderAuth],
  templateUrl: './top-bar.html',
})
export class TopBar {}

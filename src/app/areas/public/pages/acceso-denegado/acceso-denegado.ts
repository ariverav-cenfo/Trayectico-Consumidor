import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TopBar } from '../../../../shared/layout/top-bar/top-bar';

@Component({
  imports: [TopBar, RouterLink],
  selector: 'app-acceso-denegado',
  styleUrl: './acceso-denegado.css',
  templateUrl: './acceso-denegado.html',
})
export class AccesoDenegado {}

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TopBar } from '../../../../shared/layout/top-bar/top-bar';

@Component({
  imports: [TopBar, RouterLink],
  selector: 'app-pagina-no-encontrada',
  styleUrl: './pagina-no-encontrada.css',
  templateUrl: './pagina-no-encontrada.html',
})
export class PaginaNoEncontrada {}

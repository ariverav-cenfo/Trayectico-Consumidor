import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TopBar } from '../../../../shared/layout/top-bar/top-bar';
import { InicioSesionGoogle } from '../../components/inicio-sesion-google/inicio-sesion-google';

@Component({
  selector: 'app-inicio-sesion',
  imports: [TopBar, RouterLink, InicioSesionGoogle],
  templateUrl: './inicio-sesion.html',
  styleUrl: './inicio-sesion.css',
})
export class InicioSesion {}

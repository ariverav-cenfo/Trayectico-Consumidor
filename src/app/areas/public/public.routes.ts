import { Routes } from '@angular/router';
import { InicioSesion } from './pages/inicio-sesion/inicio-sesion';
import { Inicio } from './pages/inicio/inicio';
import { AccesoDenegado } from './pages/acceso-denegado/acceso-denegado';
import { PaginaNoEncontrada } from './pages/pagina-no-encontrada/pagina-no-encontrada';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: Inicio },
  { path: 'iniciar-sesion', component: InicioSesion },
  { path: 'acceso-denegado', component: AccesoDenegado },
  { path: 'pagina-no-encontrada', component: PaginaNoEncontrada },
];

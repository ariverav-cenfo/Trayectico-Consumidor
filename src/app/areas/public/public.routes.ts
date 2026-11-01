import { Routes } from '@angular/router';
import { SignIn } from './pages/sign-in/sign-in';
import { Home } from './pages/home/home';
import { AccessDenied } from './pages/access-denied/access-denied';
import { NotFound } from './pages/not-found/not-found';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: Home },
  { path: 'iniciar-sesion', component: SignIn },
  { path: 'acceso-denegado', component: AccessDenied },
  { path: 'pagina-no-encontrada', component: NotFound },
];

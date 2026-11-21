import { Routes } from '@angular/router';
import { adminGuard, usuarioGuard } from './guards/rol.guard';

export const routes: Routes = [
  {
    path: 'admin',
    canActivate: [adminGuard],
    runGuardsAndResolvers: 'always',
    loadChildren: () => import('./areas/admin/admin.routes').then((m) => m.routes),
  },
  {
    path: '',
    loadChildren: () => import('./areas/public/public.routes').then((m) => m.routes),
  },
  {
    path: '',
    canActivate: [usuarioGuard],
    runGuardsAndResolvers: 'always',
    loadChildren: () => import('./areas/user/user.routes').then((m) => m.routes),
  },
  { path: '**', redirectTo: '/pagina-no-encontrada' },
];

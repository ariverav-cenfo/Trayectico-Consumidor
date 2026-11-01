import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./areas/admin/admin.routes').then((m) => m.routes),
  },
  {
    path: '',
    loadChildren: () => import('./areas/public/public.routes').then((m) => m.routes),
  },
  {
    path: '',
    loadChildren: () => import('./areas/user/user.routes').then((m) => m.routes),
  },
  { path: '**', redirectTo: '/pagina-no-encontrada' },
];

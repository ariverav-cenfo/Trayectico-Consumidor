import { Routes } from '@angular/router';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { AdminRoutes } from './pages/admin-routes/admin-routes';
import { AdminRouteForm } from './pages/admin-route-form/admin-route-form';
import { AdminStops } from './pages/admin-stops/admin-stops';
import { AdminStopForm } from './pages/admin-stop-form/admin-stop-form';
import { AdminAlerts } from './pages/admin-alerts/admin-alerts';
import { AdminAlertForm } from './pages/admin-alert-form/admin-alert-form';
import { AdminFares } from './pages/admin-fares/admin-fares';
import { AdminUsers } from './pages/admin-users/admin-users';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: AdminDashboard },
  { path: 'rutas', component: AdminRoutes },
  { path: 'rutas/nueva', component: AdminRouteForm },
  { path: 'rutas/:id', component: AdminRouteForm },
  { path: 'paradas', component: AdminStops },
  { path: 'paradas/nueva', component: AdminStopForm },
  { path: 'paradas/:id', component: AdminStopForm },
  { path: 'avisos', component: AdminAlerts },
  { path: 'avisos/nuevo', component: AdminAlertForm },
  { path: 'avisos/:id', component: AdminAlertForm },
  { path: 'tarifas', component: AdminFares },
  { path: 'usuarios', component: AdminUsers },
];


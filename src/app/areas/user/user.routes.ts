import { Routes } from '@angular/router';
import { UserLayout } from '../../shared/layout/user-layout/user-layout';
import { Planner } from './pages/planner/planner';
import { PlannerResult } from './pages/planner-result/planner-result';
import { RoutesPage } from './pages/routes/routes';
import { RouteDetail } from './pages/route-detail/route-detail';
import { ServiceAlerts } from './pages/service-alerts/service-alerts';
import { History } from './pages/history/history';
import { Assistant } from './pages/assistant/assistant';
import { Profile } from './pages/profile/profile';

export const routes: Routes = [
  { path: 'asistente', component: Assistant },
  {
    path: '',
    component: UserLayout,
    children: [
      { path: 'planificar', component: Planner },
      { path: 'planificar/resultado', component: PlannerResult },
      { path: 'rutas', component: RoutesPage },
      { path: 'rutas/:id', component: RouteDetail },
      { path: 'avisos', component: ServiceAlerts },
      { path: 'historial', component: History },
      { path: 'perfil', component: Profile },
    ],
  },
];

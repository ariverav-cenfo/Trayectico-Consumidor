import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { PasswordRecovery } from './pages/password-recovery/password-recovery';
import { AccessDenied } from './pages/access-denied/access-denied';
import { Planner } from './pages/planner/planner';
import { PlannerResult } from './pages/planner-result/planner-result';
import { RouteDetail } from './pages/route-detail/route-detail';
import { ServiceAlerts } from './pages/service-alerts/service-alerts';
import { Assistant } from './pages/assistant/assistant';
import { Profile } from './pages/profile/profile';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { AdminRoutes } from './pages/admin-routes/admin-routes';
import { NotFound } from './pages/not-found/not-found';
import { AdminRouteForm } from './pages/admin-route-form/admin-route-form';
import { AdminStops } from './pages/admin-stops/admin-stops';
import { AdminAlertForm } from './pages/admin-alert-form/admin-alert-form';
import { AdminAlerts } from './pages/admin-alerts/admin-alerts';
import { AdminFares } from './pages/admin-fares/admin-fares';
import { AdminStopForm } from './pages/admin-stop-form/admin-stop-form';
import { AdminUsers } from './pages/admin-users/admin-users';
import { RoutesPage } from './pages/routes/routes';

export const routes: Routes = [
    { path: '', component: Home },

    { path: 'login', component: Login },
    { path: 'registro', component: Register },
    { path: 'recuperar', component: PasswordRecovery },
    { path: 'acceso-denegado', component: AccessDenied },

    { path: 'planificar', component: Planner },
    { path: 'planificar/resultado', component: PlannerResult },

    { path: 'rutas', component: RoutesPage },
    { path: 'rutas/:id', component: RouteDetail },

    { path: 'avisos', component: ServiceAlerts },
    { path: 'historial', component: History },
    { path: 'asistente', component: Assistant },
    { path: 'perfil', component: Profile },

    { path: 'admin', component: AdminDashboard },

    { path: 'admin/rutas', component: AdminRoutes },
    { path: 'admin/rutas/nueva', component: AdminRouteForm },
    { path: 'admin/rutas/:id', component: AdminRouteForm },

    { path: 'admin/paradas', component: AdminStops },
    { path: 'admin/paradas/nueva', component: AdminStopForm },
    { path: 'admin/paradas/:id', component: AdminStopForm },

    { path: 'admin/avisos', component: AdminAlerts },
    { path: 'admin/avisos/nuevo', component: AdminAlertForm },
    { path: 'admin/avisos/:id', component: AdminAlertForm },

    { path: 'admin/tarifas', component: AdminFares },
    { path: 'admin/usuarios', component: AdminUsers },

    { path: '**', component: NotFound }
];

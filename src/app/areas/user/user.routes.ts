import { Routes } from '@angular/router';
import { UserLayout } from '../../shared/layout/user-layout/user-layout';
import { Planificador } from './pages/planificador/planificador';
import { ResultadoPlanificador } from './pages/resultado-planificador/resultado-planificador';
import { Rutas } from './pages/rutas/rutas';
import { DetalleRuta } from './pages/detalle-ruta/detalle-ruta';
import { Avisos } from './pages/avisos/avisos';
import { Historial } from './pages/historial/historial';
import { Asistente } from './pages/asistente/asistente';
import { Perfil } from './pages/perfil/perfil';

export const routes: Routes = [
  { path: 'asistente', component: Asistente },
  {
    path: '',
    component: UserLayout,
    children: [
      { path: 'planificar', component: Planificador },
      { path: 'planificar/resultado', component: ResultadoPlanificador },
      { path: 'rutas', component: Rutas },
      { path: 'rutas/:id', component: DetalleRuta },
      { path: 'avisos', component: Avisos },
      { path: 'historial', component: Historial },
      { path: 'perfil', component: Perfil },
    ],
  },
];

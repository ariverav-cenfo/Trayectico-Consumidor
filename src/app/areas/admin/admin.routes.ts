import { Routes } from '@angular/router';
import { AdminPanel } from './pages/admin-panel/admin-panel';
import { AdminRutas } from './pages/admin-rutas/admin-rutas';
import { AdminFormularioRuta } from './pages/admin-formulario-ruta/admin-formulario-ruta';
import { AdminParadas } from './pages/admin-paradas/admin-paradas';
import { AdminFormularioParada } from './pages/admin-formulario-parada/admin-formulario-parada';
import { AdminAvisos } from './pages/admin-avisos/admin-avisos';
import { AdminFormularioAviso } from './pages/admin-formulario-aviso/admin-formulario-aviso';
import { AdminTarifas } from './pages/admin-tarifas/admin-tarifas';
import { AdminUsuarios } from './pages/admin-usuarios/admin-usuarios';
import { GestionRutasComponent } from './pages/gestion-rutas/gestionrutas';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: AdminPanel },
  { path: 'rutas', component: GestionRutasComponent },
  { path: 'rutas/nueva', component: AdminFormularioRuta },
  { path: 'rutas/:id', component: AdminFormularioRuta },
  { path: 'paradas', component: AdminParadas },
  { path: 'paradas/nueva', component: AdminFormularioParada },
  { path: 'paradas/:id', component: AdminFormularioParada },
  { path: 'avisos', component: AdminAvisos },
  { path: 'avisos/nuevo', component: AdminFormularioAviso },
  { path: 'avisos/:id', component: AdminFormularioAviso },
  { path: 'tarifas', component: AdminTarifas },
  { path: 'usuarios', component: AdminUsuarios },
];

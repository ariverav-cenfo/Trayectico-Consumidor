import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { RolService } from '../services/rol.service';

function requiereRol(requerido: 'usuario' | 'admin'): CanActivateFn {
  return () => {
    const rol = inject(RolService).rol();
    if (rol === 'admin' || rol === requerido) {
      return true;
    }

    return inject(Router).parseUrl(rol === 'publico' ? '/' : '/acceso-denegado');
  };
}

export const usuarioGuard = requiereRol('usuario');
export const adminGuard = requiereRol('admin');

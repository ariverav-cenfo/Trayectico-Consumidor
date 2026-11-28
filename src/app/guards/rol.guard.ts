import { inject, isDevMode } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { RolService } from '../services/rol.service';

/**
 * Crea un guard que comprueba el rol antes de cargar un área de forma diferida.
 * Permite el acceso al rol requerido y al administrador; redirige al público
 * al inicio y a los demás roles sin permiso a la página de acceso denegado.
 * @param requerido Rol mínimo autorizado para acceder al área.
 * @returns Guard de coincidencia que permite el acceso o devuelve una redirección.
 */
function requiereRol(requerido: 'usuario' | 'admin'): CanMatchFn {
  return () => {
    // Acceso temporal en desarrollo para capturar las pantallas de usuario sin login.
    const devUser =
      requerido === 'usuario' &&
      isDevMode() &&
      new URLSearchParams(globalThis.location.search).get('devUser') === '1';
    if (devUser) return true;

    const rol = inject(RolService).rol();
    if (rol === 'admin' || rol === requerido) {
      return true;
    }

    return inject(Router).parseUrl(rol === 'publico' ? '/' : '/acceso-denegado');
  };
}

/** Permite acceder al área de usuario a los roles usuario y administrador. */
export const usuarioGuard = requiereRol('usuario');
/** Permite acceder al área administrativa únicamente al rol administrador. */
export const adminGuard = requiereRol('admin');

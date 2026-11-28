import { Injectable, computed, inject, isDevMode, signal } from '@angular/core';
import { SesionService } from './sesion.service';

/** Roles disponibles para controlar el acceso a las áreas de la aplicación. */
export type Rol = 'publico' | 'usuario' | 'admin';

/**
 * Expone el rol actual a partir de la sesión de Google.
 * En modo de desarrollo se puede simular otro rol con el selector.
 */
@Injectable({ providedIn: 'root' })
export class RolService {
  private readonly sesion = inject(SesionService);
  private readonly rolSimulado = signal<Rol | null>(null);

  /** Señal de solo lectura con el rol actual: el simulado si existe, si no el de la sesión. */
  readonly rol = computed<Rol>(() => {
    const simulado = this.rolSimulado();
    if (simulado) {
      return simulado;
    }
    const usuario = this.sesion.usuario();
    if (!usuario) {
      return 'publico';
    }
    return usuario.rol === 'ADMIN' ? 'admin' : 'usuario';
  });

  /**
   * Cambia el rol simulado únicamente en modo de desarrollo.
   * @param rol Rol que se desea simular.
   */
  simular(rol: Rol): void {
    if (isDevMode()) {
      this.rolSimulado.set(rol);
    }
  }
}

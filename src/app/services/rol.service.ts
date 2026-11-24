import { Injectable, isDevMode, signal } from '@angular/core';

/** Roles disponibles para controlar el acceso a las áreas de la aplicación. */
export type Rol = 'publico' | 'usuario' | 'admin';

/** Mantiene el rol actual y permite simularlo en modo de desarrollo. */
@Injectable({ providedIn: 'root' })
export class RolService {
  private readonly rolActual = signal<Rol>('publico');
  /** Señal de solo lectura que expone el rol actual. */
  readonly rol = this.rolActual.asReadonly();

  /**
   * Cambia el rol simulado únicamente en modo de desarrollo.
   * @param rol Rol que se desea simular.
   */
  simular(rol: Rol): void {
    if (isDevMode()) {
      this.rolActual.set(rol);
    }
  }
}

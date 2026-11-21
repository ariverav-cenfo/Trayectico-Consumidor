import { Injectable, isDevMode, signal } from '@angular/core';

export type Rol = 'publico' | 'usuario' | 'admin';

@Injectable({ providedIn: 'root' })
export class RolService {
  private readonly rolActual = signal<Rol>('publico');
  readonly rol = this.rolActual.asReadonly();

  /**
   * Simula el rol actual únicamente en modo de desarrollo.
   * En producción conserva el rol actual sin modificarlo.
   * @param rol Rol que se desea simular.
   */
  simular(rol: Rol): void {
    if (isDevMode()) {
      this.rolActual.set(rol);
    }
  }
}

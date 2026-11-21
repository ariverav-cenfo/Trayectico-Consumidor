import { Injectable, isDevMode, signal } from '@angular/core';

export type Rol = 'publico' | 'usuario' | 'admin';

@Injectable({ providedIn: 'root' })
export class RolService {
  private readonly rolActual = signal<Rol>('publico');
  readonly rol = this.rolActual.asReadonly();

  simular(rol: Rol): void {
    if (isDevMode()) {
      this.rolActual.set(rol);
    }
  }
}

import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RolService } from '../../../services/rol.service';

@Component({
  selector: 'app-header-auth',
  imports: [RouterLink],
  template: `
    @if (rol() === 'publico') {
      <nav aria-label="Acceso a la cuenta">
        <a routerLink="/iniciar-sesion" class="register">Registrarse</a>
        <a routerLink="/iniciar-sesion" class="sign-in">Iniciar sesión</a>
      </nav>
    }
  `,
  styles: `
    :host { flex-shrink: 0; }
    nav { display: flex; justify-content: flex-end; gap: 8px; }
    a { display: inline-flex; align-items: center; justify-content: center; min-height: 44px;
      padding: 10px 16px; border: 1px solid white; border-radius: 8px; color: white;
      font: 700 1rem/1.25 Arial, sans-serif; text-decoration: none; white-space: nowrap; }
    .sign-in { background: white; color: #1c3a34; }
    a:hover { background: #ecf2ef; color: #1c3a34; }
    a:focus-visible { outline: 3px solid #f8b739; outline-offset: 4px; }
    @media (max-width: 600px) {
      .register { display: none; }
      a { padding-inline: 12px; font-size: 0.875rem; }
    }
  `,
})
export class HeaderAuth {
  protected readonly rol = inject(RolService).rol;
}

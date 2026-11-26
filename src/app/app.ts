import { Component, inject, isDevMode } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { RolService } from './services/rol.service';

@Component({
  imports: [RouterLink, RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  private readonly router = inject(Router);
  private readonly roles = inject(RolService);
  protected readonly desarrollo = isDevMode();
  protected readonly rol = this.roles.rol;

  protected cambiarRol(rol: string): void {
    if (rol !== 'publico' && rol !== 'usuario' && rol !== 'admin') {
      return;
    }

    this.roles.simular(rol);
    void this.router.navigateByUrl(this.router.url, { onSameUrlNavigation: 'reload' });
  }
}

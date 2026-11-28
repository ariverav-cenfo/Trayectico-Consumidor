import { Component, ElementRef, afterNextRender, inject, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SesionService } from '../../../../services/sesion.service';

/** Mensaje genérico cuando el Servidor rechaza el inicio de sesión. */
export const MENSAJE_ERROR_INICIO = 'No se pudo iniciar sesión. Intente de nuevo.';
/** Mensaje cuando no carga el script de Google (sin conexión o bloqueado). */
export const MENSAJE_ERROR_GOOGLE =
  'No se pudo cargar el inicio de sesión con Google. Revise su conexión e intente de nuevo.';

/**
 * Botón oficial de Google para iniciar sesión.
 * Al elegir la cuenta, valida la credencial con el Servidor y envía al administrador
 * al panel de administración y al resto de usuarios al planificador.
 */
@Component({
  selector: 'app-inicio-sesion-google',
  templateUrl: './inicio-sesion-google.html',
  styleUrl: './inicio-sesion-google.css',
})
export class InicioSesionGoogle {
  private readonly sesion = inject(SesionService);
  private readonly router = inject(Router);
  private readonly contenedor = viewChild.required<ElementRef<HTMLElement>>('botonGoogle');

  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);

  constructor() {
    // Google dibuja el botón en el DOM, así que se espera a que la vista exista
    afterNextRender(() => {
      this.sesion
        .mostrarBotonGoogle(this.contenedor().nativeElement, (credencial) =>
          this.iniciar(credencial),
        )
        .then(() => this.cargando.set(false))
        .catch(() => {
          this.cargando.set(false);
          this.error.set(MENSAJE_ERROR_GOOGLE);
        });
    });
  }

  /**
   * Abre la sesión con la credencial de Google y redirige según el rol.
   * Si el Servidor la rechaza, muestra un mensaje genérico sin detalles.
   */
  private iniciar(credencial: string): void {
    this.error.set(null);
    this.sesion.iniciarSesion(credencial).subscribe({
      next: (usuario) =>
        void this.router.navigateByUrl(usuario.rol === 'ADMIN' ? '/admin' : '/planificar'),
      error: () => this.error.set(MENSAJE_ERROR_INICIO),
    });
  }
}

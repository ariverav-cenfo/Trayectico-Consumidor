import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  InicioSesionGoogle,
  MENSAJE_ERROR_GOOGLE,
  MENSAJE_ERROR_INICIO,
} from './inicio-sesion-google';
import { SesionService } from '../../../../services/sesion.service';
import type { UsuarioActual } from '../../../../interfaces/usuario-actual';

describe('InicioSesionGoogle', () => {
  let fixture: ComponentFixture<InicioSesionGoogle>;
  let router: Router;
  let elegirCuenta: (credencial: string) => void;
  const sesion = {
    mostrarBotonGoogle: vi.fn(),
    iniciarSesion: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    sesion.mostrarBotonGoogle.mockImplementation(
      async (_elemento: HTMLElement, alElegirCuenta: (credencial: string) => void) => {
        elegirCuenta = alElegirCuenta;
      },
    );
    await TestBed.configureTestingModule({
      imports: [InicioSesionGoogle],
      providers: [provideRouter([]), { provide: SesionService, useValue: sesion }],
    }).compileComponents();
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    fixture = TestBed.createComponent(InicioSesionGoogle);
    await fixture.whenStable();
  });

  /** Simula que el usuario elige su cuenta y el Servidor responde con el usuario indicado. */
  async function elegirCuentaCon(usuario: UsuarioActual) {
    sesion.iniciarSesion.mockReturnValue(of(usuario));
    elegirCuenta('credencial-de-google');
    await fixture.whenStable();
  }

  it('muestra el botón de Google al cargar', () => {
    expect(sesion.mostrarBotonGoogle).toHaveBeenCalled();
  });

  it('envía al administrador al panel de administración', async () => {
    await elegirCuentaCon({ correo: 'admin@ejemplo.com', rol: 'ADMIN' });

    expect(sesion.iniciarSesion).toHaveBeenCalledWith('credencial-de-google');
    expect(router.navigateByUrl).toHaveBeenCalledWith('/admin');
  });

  it('envía al usuario al planificador', async () => {
    await elegirCuentaCon({ correo: 'usuario@ejemplo.com', rol: 'USUARIO' });

    expect(router.navigateByUrl).toHaveBeenCalledWith('/planificar');
  });

  it('muestra un mensaje genérico si el Servidor rechaza el inicio de sesión', async () => {
    sesion.iniciarSesion.mockReturnValue(throwError(() => new Error('401')));
    elegirCuenta('credencial-invalida');
    await fixture.whenStable();

    const alerta: HTMLElement = fixture.nativeElement.querySelector('[role="alert"]');
    expect(alerta.textContent).toContain(MENSAJE_ERROR_INICIO);
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });

  it('avisa si no se pudo cargar el script de Google', async () => {
    sesion.mostrarBotonGoogle.mockRejectedValue(new Error('sin conexión'));
    const otro = TestBed.createComponent(InicioSesionGoogle);
    await otro.whenStable();
    // El error llega cuando la promesa de Google se rechaza, después del primer dibujo
    await Promise.resolve();
    await otro.whenStable();

    const alerta: HTMLElement = otro.nativeElement.querySelector('[role="alert"]');
    expect(alerta.textContent).toContain(MENSAJE_ERROR_GOOGLE);
  });
});

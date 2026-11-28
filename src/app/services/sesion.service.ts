import { DOCUMENT, Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import type { GoogleIdentidad } from '../interfaces/google-identidad';
import type { UsuarioActual } from '../interfaces/usuario-actual';

const CLAVE_SESION = 'trayectico-sesion';
const URL_SCRIPT_GOOGLE = 'https://accounts.google.com/gsi/client';

/** Aviso al cerrar la sesión con el botón. */
export const MENSAJE_SESION_CERRADA = 'Sesión cerrada.';
/** Aviso cuando el token de Google venció o el Servidor lo rechazó. */
export const MENSAJE_SESION_EXPIRADA = 'Su sesión venció. Inicie sesión de nuevo.';
/** Aviso cuando la sesión se cierra por inactividad. */
export const MENSAJE_SESION_INACTIVIDAD = 'Su sesión se cerró por inactividad.';
/** Tiempo sin actividad tras el cual se cierra la sesión: 15 minutos. */
export const TIEMPO_INACTIVIDAD_MS = 15 * 60 * 1000;

/** Eventos que cuentan como actividad del usuario. */
const EVENTOS_ACTIVIDAD = ['pointerdown', 'keydown', 'scroll', 'touchstart'] as const;

/** Sesión que se guarda en sessionStorage para sobrevivir a una recarga de la página. */
interface SesionGuardada {
  token: string;
  usuario: UsuarioActual;
  /** Momento en que vence el token, en milisegundos desde 1970. */
  expira: number;
}

/**
 * Sesión con Google: muestra el botón oficial, valida la credencial con el Servidor
 * y guarda el token y el rol mientras la pestaña esté abierta.
 * La sesión se cierra sola tras 15 minutos sin actividad o cuando vence el token de Google.
 * El rol guardado solo decide lo que se muestra; la seguridad real la aplica el Servidor.
 */
@Injectable({ providedIn: 'root' })
export class SesionService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly documento = inject(DOCUMENT);

  private readonly sesion = signal<SesionGuardada | null>(leerSesionGuardada());
  private readonly mensajeCierreActual = signal<string | null>(null);
  private cargaGoogle?: Promise<GoogleIdentidad>;
  private temporizadorInactividad?: ReturnType<typeof setTimeout>;
  private temporizadorVencimiento?: ReturnType<typeof setTimeout>;
  private readonly alHaberActividad = () => this.programarCierrePorInactividad();

  /** Usuario con sesión activa, o null si no hay sesión. */
  readonly usuario = computed(() => this.sesion()?.usuario ?? null);
  /** Indica si hay una sesión activa. */
  readonly activa = computed(() => this.sesion() !== null);
  /** Indica si la sesión activa es de un administrador. */
  readonly esAdmin = computed(() => this.sesion()?.usuario.rol === 'ADMIN');
  /** Aviso pendiente de que la sesión se cerró, o null si no hay aviso. */
  readonly mensajeCierre = this.mensajeCierreActual.asReadonly();

  constructor() {
    // Si la sesión se recuperó de sessionStorage, se vuelve a vigilar
    if (this.sesion()) {
      this.vigilarSesion();
    }
  }

  /** Devuelve el id_token de la sesión activa, o null si no hay sesión. */
  token(): string | null {
    return this.sesion()?.token ?? null;
  }

  /**
   * Muestra el botón oficial de Google dentro del elemento indicado.
   * @param elemento contenedor donde Google dibuja el botón
   * @param alElegirCuenta recibe la credencial (id_token) cuando el usuario elige su cuenta
   */
  async mostrarBotonGoogle(
    elemento: HTMLElement,
    alElegirCuenta: (credencial: string) => void,
  ): Promise<void> {
    const google = await this.cargarGoogle();
    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (respuesta) => alElegirCuenta(respuesta.credential),
    });
    google.accounts.id.renderButton(elemento, {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      text: 'continue_with',
      shape: 'rectangular',
      width: Math.max(200, Math.min(400, elemento.clientWidth || 320)),
      locale: 'es',
    });
  }

  /**
   * Valida la credencial de Google con el Servidor y abre la sesión.
   * Si el token no sirve, el Servidor responde 401 y la sesión no se abre.
   * @param credencial id_token que entregó Google
   * @returns el usuario con el rol que asignó el Servidor
   */
  iniciarSesion(credencial: string): Observable<UsuarioActual> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${credencial}` });
    return this.http
      .get<UsuarioActual>(`${environment.apiUrl}/api/usuarios/yo`, { headers })
      .pipe(
        tap((usuario) =>
          this.guardarSesion({ token: credencial, usuario, expira: leerExpiracion(credencial) }),
        ),
      );
  }

  /**
   * Cierra la sesión: borra el token, deja un aviso y vuelve al inicio.
   * Lo que el usuario estuviera haciendo se descarta al salir de la pantalla.
   * @param mensaje aviso que se muestra al volver al inicio
   */
  cerrarSesion(mensaje = MENSAJE_SESION_CERRADA): void {
    this.detenerVigilancia();
    this.sesion.set(null);
    borrarSesionGuardada();
    // Evita que Google vuelva a entrar solo con la misma cuenta
    this.obtenerGoogle()?.accounts.id.disableAutoSelect();
    this.mensajeCierreActual.set(mensaje);
    void this.router.navigateByUrl('/');
  }

  /** Borra el aviso de cierre de sesión después de mostrarlo. */
  descartarMensajeCierre(): void {
    this.mensajeCierreActual.set(null);
  }

  /** Guarda la sesión en memoria y en sessionStorage, y empieza a vigilarla. */
  private guardarSesion(sesion: SesionGuardada): void {
    this.mensajeCierreActual.set(null);
    this.sesion.set(sesion);
    try {
      sessionStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
    } catch {
      // Sin almacenamiento disponible la sesión dura solo hasta recargar
    }
    this.vigilarSesion();
  }

  /**
   * Programa los dos cierres automáticos de la sesión:
   * por 15 minutos de inactividad y por el vencimiento del token de Google (1 hora).
   */
  private vigilarSesion(): void {
    this.detenerVigilancia();
    const sesion = this.sesion();
    if (!sesion) {
      return;
    }
    const restante = Math.max(0, sesion.expira - Date.now());
    this.temporizadorVencimiento = setTimeout(
      () => this.cerrarSesion(MENSAJE_SESION_EXPIRADA),
      restante,
    );
    for (const evento of EVENTOS_ACTIVIDAD) {
      // capture: también cuenta el scroll dentro de cualquier elemento
      this.documento.addEventListener(evento, this.alHaberActividad, {
        capture: true,
        passive: true,
      });
    }
    this.programarCierrePorInactividad();
  }

  /** Reinicia la cuenta de 15 minutos; se llama con cada actividad del usuario. */
  private programarCierrePorInactividad(): void {
    clearTimeout(this.temporizadorInactividad);
    this.temporizadorInactividad = setTimeout(
      () => this.cerrarSesion(MENSAJE_SESION_INACTIVIDAD),
      TIEMPO_INACTIVIDAD_MS,
    );
  }

  /** Cancela los cierres automáticos y deja de escuchar la actividad. */
  private detenerVigilancia(): void {
    clearTimeout(this.temporizadorInactividad);
    clearTimeout(this.temporizadorVencimiento);
    for (const evento of EVENTOS_ACTIVIDAD) {
      this.documento.removeEventListener(evento, this.alHaberActividad, { capture: true });
    }
  }

  /** Carga el script de Google una sola vez y devuelve el objeto global `google`. */
  private cargarGoogle(): Promise<GoogleIdentidad> {
    const existente = this.obtenerGoogle();
    if (existente) {
      return Promise.resolve(existente);
    }
    this.cargaGoogle ??= new Promise<GoogleIdentidad>((resolver, rechazar) => {
      const script = this.documento.createElement('script');
      script.src = URL_SCRIPT_GOOGLE;
      script.async = true;
      script.onload = () => {
        const google = this.obtenerGoogle();
        if (google) {
          resolver(google);
        } else {
          rechazar(new Error('Google Identity Services no está disponible'));
        }
      };
      script.onerror = () => {
        this.cargaGoogle = undefined;
        rechazar(new Error('No se pudo cargar Google Identity Services'));
      };
      this.documento.head.appendChild(script);
    });
    return this.cargaGoogle;
  }

  /** Devuelve el objeto global `google`, o undefined si el script no se ha cargado. */
  private obtenerGoogle(): GoogleIdentidad | undefined {
    const ventana = this.documento.defaultView as (Window & { google?: GoogleIdentidad }) | null;
    return ventana?.google;
  }
}

/** Lee la sesión guardada; la descarta si está dañada o el token ya venció. */
function leerSesionGuardada(): SesionGuardada | null {
  try {
    const guardada: unknown = JSON.parse(sessionStorage.getItem(CLAVE_SESION) ?? 'null');
    if (!esSesionGuardada(guardada) || Date.now() >= guardada.expira) {
      borrarSesionGuardada();
      return null;
    }
    return guardada;
  } catch {
    borrarSesionGuardada();
    return null;
  }
}

/** Borra la sesión de sessionStorage. */
function borrarSesionGuardada(): void {
  try {
    sessionStorage.removeItem(CLAVE_SESION);
  } catch {
    // Sin almacenamiento disponible no hay nada que borrar
  }
}

/** Indica si el valor tiene la forma de una sesión guardada. */
function esSesionGuardada(valor: unknown): valor is SesionGuardada {
  if (typeof valor !== 'object' || valor === null) {
    return false;
  }
  const { token, usuario, expira } = valor as Record<string, unknown>;
  if (
    typeof token !== 'string' ||
    typeof expira !== 'number' ||
    typeof usuario !== 'object' ||
    usuario === null
  ) {
    return false;
  }
  const { correo, rol } = usuario as Record<string, unknown>;
  return typeof correo === 'string' && (rol === 'ADMIN' || rol === 'USUARIO');
}

/**
 * Lee el vencimiento (claim exp) del id_token de Google.
 * Solo decodifica el contenido; la firma la valida el Servidor.
 * @returns milisegundos desde 1970, o 0 si el token no se puede leer
 */
function leerExpiracion(token: string): number {
  try {
    const contenido = token.split('.')[1] ?? '';
    const base64 = contenido.replace(/-/g, '+').replace(/_/g, '/');
    const relleno = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
    const { exp } = JSON.parse(atob(relleno)) as { exp?: unknown };
    return typeof exp === 'number' ? exp * 1000 : 0;
  } catch {
    return 0;
  }
}

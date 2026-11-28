/**
 * Tipos mínimos de Google Identity Services (script accounts.google.com/gsi/client).
 * Solo se declara lo que usa la aplicación.
 */

/** Respuesta que entrega Google cuando el usuario elige su cuenta. */
export interface RespuestaCredencialGoogle {
  /** id_token de Google en formato JWT. */
  credential: string;
}

/** Configuración del inicio de sesión con Google. */
export interface ConfiguracionGoogle {
  client_id: string;
  callback: (respuesta: RespuestaCredencialGoogle) => void;
}

/** Opciones de presentación del botón oficial de Google. */
export interface OpcionesBotonGoogle {
  type?: 'standard' | 'icon';
  theme?: 'outline' | 'filled_blue' | 'filled_black';
  size?: 'large' | 'medium' | 'small';
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
  shape?: 'rectangular' | 'pill' | 'circle' | 'square';
  /** Ancho en píxeles, entre 200 y 400. */
  width?: number;
  locale?: string;
}

/** Objeto global `google` que deja el script de Google Identity Services. */
export interface GoogleIdentidad {
  accounts: {
    id: {
      initialize(configuracion: ConfiguracionGoogle): void;
      renderButton(elemento: HTMLElement, opciones: OpcionesBotonGoogle): void;
      disableAutoSelect(): void;
    };
  };
}

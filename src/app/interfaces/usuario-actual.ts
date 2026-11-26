/**
 * Usuario con sesión iniciada, tal como lo devuelve GET /api/usuarios/yo.
 * El rol lo decide el Servidor según el correo verificado de Google.
 */
export interface UsuarioActual {
  /** Correo de la cuenta de Google. */
  correo: string;
  /** Rol asignado por el Servidor. */
  rol: 'ADMIN' | 'USUARIO';
}

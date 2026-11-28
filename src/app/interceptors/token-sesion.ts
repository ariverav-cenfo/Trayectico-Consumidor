import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { MENSAJE_SESION_EXPIRADA, SesionService } from '../services/sesion.service';

/**
 * Agrega el id_token de Google a las peticiones hacia la API de Trayectico
 * y cierra la sesión si el Servidor responde 401 (token vencido o rechazado).
 * El token nunca se envía a servicios externos, como el de geocodificación.
 */
export const tokenSesionInterceptor: HttpInterceptorFn = (peticion, siguiente) => {
  const sesion = inject(SesionService);
  const token = sesion.token();
  const esApiPropia = peticion.url.startsWith(`${environment.apiUrl}/api/`);

  // Si la petición ya trae Authorization (el inicio de sesión), se respeta
  const peticionFinal =
    token && esApiPropia && !peticion.headers.has('Authorization')
      ? peticion.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : peticion;

  return siguiente(peticionFinal).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 401 && sesion.activa()) {
        sesion.cerrarSesion(MENSAJE_SESION_EXPIRADA);
      }
      return throwError(() => error);
    }),
  );
};

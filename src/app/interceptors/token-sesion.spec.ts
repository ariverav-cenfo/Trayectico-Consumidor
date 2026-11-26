import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { tokenSesionInterceptor } from './token-sesion';
import { MENSAJE_SESION_EXPIRADA, SesionService } from '../services/sesion.service';

describe('tokenSesionInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  const sesion = {
    token: vi.fn<() => string | null>(),
    activa: vi.fn<() => boolean>(),
    cerrarSesion: vi.fn<(mensaje?: string) => void>(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([tokenSesionInterceptor])),
        provideHttpClientTesting(),
        { provide: SesionService, useValue: sesion },
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('agrega el token a las peticiones de la API cuando hay sesión', () => {
    sesion.token.mockReturnValue('token-valido');

    http.get('/api/rutas').subscribe();

    const peticion = httpMock.expectOne('/api/rutas');
    expect(peticion.request.headers.get('Authorization')).toBe('Bearer token-valido');
    peticion.flush([]);
  });

  it('no envía el token a servicios externos', () => {
    sesion.token.mockReturnValue('token-valido');

    http.get('https://nominatim.openstreetmap.org/search').subscribe();

    const peticion = httpMock.expectOne('https://nominatim.openstreetmap.org/search');
    expect(peticion.request.headers.has('Authorization')).toBe(false);
    peticion.flush([]);
  });

  it('no agrega nada si no hay sesión', () => {
    sesion.token.mockReturnValue(null);

    http.get('/api/rutas').subscribe();

    const peticion = httpMock.expectOne('/api/rutas');
    expect(peticion.request.headers.has('Authorization')).toBe(false);
    peticion.flush([]);
  });

  it('cierra la sesión si el Servidor responde 401 con una sesión activa', async () => {
    sesion.token.mockReturnValue('token-vencido');
    sesion.activa.mockReturnValue(true);

    const resultado = firstValueFrom(http.get('/api/rutas'));
    httpMock.expectOne('/api/rutas').flush(null, { status: 401, statusText: 'Unauthorized' });

    await expect(resultado).rejects.toBeTruthy();
    expect(sesion.cerrarSesion).toHaveBeenCalledWith(MENSAJE_SESION_EXPIRADA);
  });

  it('no cierra nada si el 401 llega sin sesión activa', async () => {
    sesion.token.mockReturnValue(null);
    sesion.activa.mockReturnValue(false);

    const resultado = firstValueFrom(http.get('/api/usuarios/yo'));
    httpMock.expectOne('/api/usuarios/yo').flush(null, { status: 401, statusText: 'Unauthorized' });

    await expect(resultado).rejects.toBeTruthy();
    expect(sesion.cerrarSesion).not.toHaveBeenCalled();
  });
});

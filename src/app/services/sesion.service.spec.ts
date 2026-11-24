import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router, provideRouter } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  MENSAJE_SESION_CERRADA,
  MENSAJE_SESION_EXPIRADA,
  MENSAJE_SESION_INACTIVIDAD,
  SesionService,
  TIEMPO_INACTIVIDAD_MS,
} from './sesion.service';
import type { UsuarioActual } from '../interfaces/usuario-actual';

const CLAVE_SESION = 'trayectico-sesion';
const URL_YO = '/api/usuarios/yo';
const UNA_HORA_MS = 60 * 60 * 1000;

/** Arma un token con la forma de un id_token de Google que vence en el momento indicado. */
function crearToken(venceEnMs: number): string {
  const base64url = (texto: string) =>
    btoa(texto).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const contenido = { email: 'prueba@ejemplo.com', exp: Math.floor(venceEnMs / 1000) };
  return `${base64url('{"alg":"RS256"}')}.${base64url(JSON.stringify(contenido))}.firma`;
}

describe('SesionService', () => {
  let servicio: SesionService;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    vi.useFakeTimers();
    sessionStorage.removeItem(CLAVE_SESION);
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
    servicio = TestBed.inject(SesionService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
  });

  afterEach(() => {
    httpMock.verify();
    sessionStorage.removeItem(CLAVE_SESION);
    vi.useRealTimers();
  });

  /** Inicia sesión respondiendo GET /api/usuarios/yo con el usuario indicado. */
  async function iniciar(usuario: UsuarioActual, token = crearToken(Date.now() + UNA_HORA_MS)) {
    const resultado = firstValueFrom(servicio.iniciarSesion(token));
    httpMock.expectOne(URL_YO).flush(usuario);
    return resultado;
  }

  it('abre la sesión con el rol que devuelve el Servidor y la guarda', async () => {
    const token = crearToken(Date.now() + UNA_HORA_MS);
    const resultado = firstValueFrom(servicio.iniciarSesion(token));

    const peticion = httpMock.expectOne(URL_YO);
    expect(peticion.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    peticion.flush({ correo: 'admin@ejemplo.com', rol: 'ADMIN' });
    await resultado;

    expect(servicio.activa()).toBe(true);
    expect(servicio.esAdmin()).toBe(true);
    expect(servicio.token()).toBe(token);
    expect(sessionStorage.getItem(CLAVE_SESION)).not.toBeNull();
  });

  it('no abre la sesión si el Servidor rechaza el token', async () => {
    const resultado = firstValueFrom(servicio.iniciarSesion(crearToken(Date.now() + UNA_HORA_MS)));
    httpMock.expectOne(URL_YO).flush(null, { status: 401, statusText: 'Unauthorized' });

    await expect(resultado).rejects.toBeTruthy();
    expect(servicio.activa()).toBe(false);
    expect(sessionStorage.getItem(CLAVE_SESION)).toBeNull();
  });

  it('cerrar sesión borra el token, deja el aviso y vuelve al inicio', async () => {
    await iniciar({ correo: 'usuario@ejemplo.com', rol: 'USUARIO' });

    servicio.cerrarSesion();

    expect(servicio.activa()).toBe(false);
    expect(servicio.token()).toBeNull();
    expect(sessionStorage.getItem(CLAVE_SESION)).toBeNull();
    expect(servicio.mensajeCierre()).toBe(MENSAJE_SESION_CERRADA);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/');

    servicio.descartarMensajeCierre();
    expect(servicio.mensajeCierre()).toBeNull();
  });

  it('cierra la sesión tras 15 minutos sin actividad', async () => {
    await iniciar({ correo: 'usuario@ejemplo.com', rol: 'USUARIO' });

    vi.advanceTimersByTime(TIEMPO_INACTIVIDAD_MS - 1);
    expect(servicio.activa()).toBe(true);

    vi.advanceTimersByTime(1);
    expect(servicio.activa()).toBe(false);
    expect(servicio.mensajeCierre()).toBe(MENSAJE_SESION_INACTIVIDAD);
  });

  it('la actividad del usuario reinicia la cuenta de inactividad', async () => {
    await iniciar({ correo: 'usuario@ejemplo.com', rol: 'USUARIO' });

    vi.advanceTimersByTime(TIEMPO_INACTIVIDAD_MS - 1000);
    document.dispatchEvent(new KeyboardEvent('keydown'));
    vi.advanceTimersByTime(TIEMPO_INACTIVIDAD_MS - 1000);

    expect(servicio.activa()).toBe(true);
  });

  it('cierra la sesión cuando vence el token aunque haya actividad', async () => {
    await iniciar(
      { correo: 'usuario@ejemplo.com', rol: 'USUARIO' },
      crearToken(Date.now() + 10 * 60 * 1000),
    );

    vi.advanceTimersByTime(5 * 60 * 1000);
    document.dispatchEvent(new KeyboardEvent('keydown'));
    vi.advanceTimersByTime(5 * 60 * 1000);

    expect(servicio.activa()).toBe(false);
    expect(servicio.mensajeCierre()).toBe(MENSAJE_SESION_EXPIRADA);
  });

  it('recupera una sesión vigente guardada y descarta una vencida', () => {
    const vigente = {
      token: crearToken(Date.now() + UNA_HORA_MS),
      usuario: { correo: 'usuario@ejemplo.com', rol: 'USUARIO' },
      expira: Date.now() + UNA_HORA_MS,
    };
    sessionStorage.setItem(CLAVE_SESION, JSON.stringify(vigente));
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
    expect(TestBed.inject(SesionService).activa()).toBe(true);

    sessionStorage.setItem(CLAVE_SESION, JSON.stringify({ ...vigente, expira: Date.now() - 1 }));
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
    httpMock = TestBed.inject(HttpTestingController);
    expect(TestBed.inject(SesionService).activa()).toBe(false);
    expect(sessionStorage.getItem(CLAVE_SESION)).toBeNull();
  });
});

import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { RolService } from './rol.service';
import { SesionService } from './sesion.service';
import type { UsuarioActual } from '../interfaces/usuario-actual';

describe('RolService', () => {
  const usuario = signal<UsuarioActual | null>(null);
  let servicio: RolService;

  beforeEach(() => {
    usuario.set(null);
    TestBed.configureTestingModule({
      providers: [{ provide: SesionService, useValue: { usuario } }],
    });
    servicio = TestBed.inject(RolService);
  });

  it('es publico cuando no hay sesión', () => {
    expect(servicio.rol()).toBe('publico');
  });

  it('es usuario cuando la sesión tiene rol USUARIO', () => {
    usuario.set({ correo: 'persona@ejemplo.com', rol: 'USUARIO' });
    expect(servicio.rol()).toBe('usuario');
  });

  it('es admin cuando la sesión tiene rol ADMIN', () => {
    usuario.set({ correo: 'admin@ejemplo.com', rol: 'ADMIN' });
    expect(servicio.rol()).toBe('admin');
  });

  it('vuelve a publico al cerrar la sesión', () => {
    usuario.set({ correo: 'admin@ejemplo.com', rol: 'ADMIN' });
    usuario.set(null);
    expect(servicio.rol()).toBe('publico');
  });

  it('en desarrollo el rol simulado tiene prioridad sobre la sesión', () => {
    usuario.set({ correo: 'persona@ejemplo.com', rol: 'USUARIO' });
    servicio.simular('admin');
    expect(servicio.rol()).toBe('admin');
  });
});

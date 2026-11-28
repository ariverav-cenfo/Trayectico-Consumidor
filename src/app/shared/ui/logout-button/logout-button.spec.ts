import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LogoutButton } from './logout-button';
import { SesionService } from '../../../services/sesion.service';

describe('LogoutButton', () => {
  let fixture: ComponentFixture<LogoutButton>;
  const activa = signal(false);
  const sesion = { activa, cerrarSesion: vi.fn() };

  beforeEach(async () => {
    activa.set(false);
    sesion.cerrarSesion.mockClear();
    await TestBed.configureTestingModule({
      imports: [LogoutButton],
      providers: [{ provide: SesionService, useValue: sesion }],
    }).compileComponents();
    fixture = TestBed.createComponent(LogoutButton);
  });

  it('no muestra la opción sin una sesión activa', async () => {
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('button')).toBeNull();
  });

  it('con sesión activa muestra la opción y cierra la sesión al tocarla', async () => {
    activa.set(true);
    await fixture.whenStable();

    const boton: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(boton.textContent).toContain('Cerrar sesión');

    boton.click();
    expect(sesion.cerrarSesion).toHaveBeenCalled();
  });
});

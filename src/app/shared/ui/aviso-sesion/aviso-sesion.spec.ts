import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { beforeEach, describe, expect, it } from 'vitest';
import { AvisoSesion } from './aviso-sesion';
import { SesionService } from '../../../services/sesion.service';

describe('AvisoSesion', () => {
  let fixture: ComponentFixture<AvisoSesion>;
  const mensajeCierre = signal<string | null>(null);
  const sesion = {
    mensajeCierre,
    descartarMensajeCierre: () => mensajeCierre.set(null),
  };

  beforeEach(async () => {
    mensajeCierre.set(null);
    await TestBed.configureTestingModule({
      imports: [AvisoSesion],
      providers: [{ provide: SesionService, useValue: sesion }],
    }).compileComponents();
    fixture = TestBed.createComponent(AvisoSesion);
  });

  it('no muestra nada si no hay aviso pendiente', async () => {
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('[role="status"]')).toBeNull();
  });

  it('muestra el aviso y lo quita al cerrarlo', async () => {
    mensajeCierre.set('Sesión cerrada.');
    await fixture.whenStable();

    const aviso: HTMLElement = fixture.nativeElement.querySelector('[role="status"]');
    expect(aviso.textContent).toContain('Sesión cerrada.');

    fixture.nativeElement.querySelector('button').click();
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('[role="status"]')).toBeNull();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { ResultadoPlanificador } from './resultado-planificador';

describe('ResultadoPlanificador', () => {
  let component: ResultadoPlanificador;
  let fixture: ComponentFixture<ResultadoPlanificador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultadoPlanificador],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResultadoPlanificador);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('updates the map, steps and payment when selecting another option', async () => {
    const element = fixture.nativeElement as HTMLElement;
    const options = element.querySelectorAll<HTMLButtonElement>('app-opciones-resultado button');
    const firstPoints = element.querySelector('polyline')!.getAttribute('points');
    expect(element.querySelectorAll('app-paso-viaje')).toHaveLength(4);
    expect(options[0].getAttribute('aria-pressed')).toBe('true');
    options[1].click();
    await fixture.whenStable();
    expect(options[1].getAttribute('aria-pressed')).toBe('true');
    expect(options[0].getAttribute('aria-pressed')).toBe('false');
    expect(element.querySelectorAll('app-paso-viaje')).toHaveLength(5);
    expect(element.querySelector('polyline')!.getAttribute('points')).not.toBe(firstPoints);
    expect(element.querySelector('app-tarifa')!.textContent).toContain('cada ruta');
    expect(element.querySelector('app-enlace-detalle-ruta a')!.getAttribute('href')).toBe(
      '/rutas/0002',
    );
  });

  it('vuelve al planificador con los nombres y las coordenadas, sin el tripId', async () => {
    await TestBed.inject(Router).navigateByUrl(
      '/?origin=Hospital&destination=Paseo&tripId=abc' +
      '&origen_lat=9.990397&origen_lon=-84.1218642&destino_lat=9.9849782&destino_lon=-84.1113713',
    );
    await fixture.whenStable();
    const href = (fixture.nativeElement as HTMLElement)
      .querySelector('a.back')!
      .getAttribute('href')!;
    expect(href).toContain('/planificar?');
    expect(href).toContain('origin=Hospital');
    expect(href).toContain('destination=Paseo');
    expect(href).toContain('origen_lat=9.990397');
    expect(href).toContain('origen_lon=-84.1218642');
    expect(href).toContain('destino_lat=9.9849782');
    expect(href).toContain('destino_lon=-84.1113713');
    expect(href).not.toContain('tripId');
  });
});
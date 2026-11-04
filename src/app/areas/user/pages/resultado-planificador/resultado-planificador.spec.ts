import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResultadoPlanificador } from './resultado-planificador';
import { provideRouter } from '@angular/router';

describe('ResultadoPlanificador', () => {
  let component: ResultadoPlanificador;
  let fixture: ComponentFixture<ResultadoPlanificador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultadoPlanificador],
      providers: [provideRouter([])],
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
});

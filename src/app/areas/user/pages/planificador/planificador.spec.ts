import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Planificador } from './planificador';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';
import { ESPERA_BUSQUEDA_MS, PHOTON_URL } from '../../../../services/geo/parametros-geo';

/** Espera el tiempo indicado con temporizadores reales. */
const esperar = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Respuesta de Photon con un solo lugar. GeoJSON trae las coordenadas como [lon, lat]. */
function respuestaPhoton(nombre: string, lat: number, lon: number) {
  return {
    features: [
      {
        geometry: { coordinates: [lon, lat] },
        properties: { name: nombre, city: nombre, state: 'San José' },
      },
    ],
  };
}

describe('Planificador', () => {
  let component: Planificador;
  let fixture: ComponentFixture<Planificador>;
  let http: HttpTestingController;

  beforeEach(async () => {
    localStorage.removeItem('trayectico-recent-searches');
    await TestBed.configureTestingModule({
      imports: [Planificador],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    http = TestBed.inject(HttpTestingController);

    fixture = TestBed.createComponent(Planificador);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  /**
   * Escribe en un campo, responde la búsqueda de Photon con un lugar y lo elige de la lista.
   * Así el campo queda con un lugar reconocido, como cuando lo usa una persona.
   */
  async function elegirLugar(
    campo: 'Origen' | 'Destino',
    nombre: string,
    lat: number,
    lon: number,
  ): Promise<void> {
    const element = fixture.nativeElement as HTMLElement;
    const input = element.querySelector<HTMLInputElement>(`#txt${campo}`)!;
    input.value = nombre;
    input.dispatchEvent(new Event('input'));
    await esperar(ESPERA_BUSQUEDA_MS + 50);
    http
      .expectOne((req) => req.url === PHOTON_URL && req.params.get('q') === nombre)
      .flush(respuestaPhoton(nombre, lat, lon));
    await fixture.whenStable();
    element.querySelector<HTMLButtonElement>(`#lstSugerencias${campo} button`)!.click();
    await fixture.whenStable();
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('swaps places and restores a recent search into the form', async () => {
    const element = fixture.nativeElement as HTMLElement;
    const origin = element.querySelector<HTMLInputElement>('#txtOrigen')!;
    const destination = element.querySelector<HTMLInputElement>('#txtDestino')!;
    await elegirLugar('Origen', 'San José', 9.9325, -84.0796);
    await elegirLugar('Destino', 'Heredia', 9.9981, -84.117);
    element.querySelector<HTMLButtonElement>('#btnIntercambiar')!.click();
    await fixture.whenStable();
    expect(origin.value).toBe('Heredia');
    expect(destination.value).toBe('San José');
    element.querySelector('form')!.dispatchEvent(new Event('submit', { cancelable: true }));
    await fixture.whenStable();
    expect(JSON.parse(localStorage.getItem('trayectico-recent-searches')!)).toEqual([
      {
        origin: 'Heredia',
        destination: 'San José',
        coordenadas: {
          origen: { lat: 9.9981, lon: -84.117 },
          destino: { lat: 9.9325, lon: -84.0796 },
        },
      },
    ]);
    expect(TestBed.inject(Router).navigate).toHaveBeenCalledWith(['/planificar/resultado'], {
      queryParams: expect.objectContaining({
        origin: 'Heredia',
        destination: 'San José',
        tripId: expect.any(String),
        origen_lat: 9.9981,
        origen_lon: -84.117,
        destino_lat: 9.9325,
        destino_lon: -84.0796,
      }),
    });
    element.querySelector<HTMLButtonElement>('#btnIntercambiar')!.click();
    await fixture.whenStable();
    element.querySelector<HTMLButtonElement>('app-item-busqueda-reciente button')!.click();
    await fixture.whenStable();
    expect(origin.value).toBe('Heredia');
    expect(destination.value).toBe('San José');

    // La búsqueda reciente vuelve con coordenadas: se puede buscar sin elegir los lugares de nuevo.
    element.querySelector('form')!.dispatchEvent(new Event('submit', { cancelable: true }));
    await fixture.whenStable();
    expect(element.querySelector('#errorOrigen')).toBeNull();
    expect(element.querySelector('#errorDestino')).toBeNull();
    expect(TestBed.inject(Router).navigate).toHaveBeenCalledTimes(2);
  });

  afterEach(() => localStorage.removeItem('trayectico-recent-searches'));
});

describe('Planificador al volver de los resultados', () => {
  afterEach(() => localStorage.removeItem('trayectico-recent-searches'));

  it('restaura origen y destino con coordenadas desde los query params', async () => {
    localStorage.removeItem('trayectico-recent-searches');
    await TestBed.configureTestingModule({
      imports: [Planificador],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    const router = TestBed.inject(Router);
    await router.navigateByUrl(
      '/?origin=San%20Jos%C3%A9&destination=Heredia' +
      '&origen_lat=9.9325&origen_lon=-84.0796&destino_lat=9.9981&destino_lon=-84.117',
    );
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    const fixture = TestBed.createComponent(Planificador);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector<HTMLInputElement>('#txtOrigen')!.value).toBe('San José');
    expect(element.querySelector<HTMLInputElement>('#txtDestino')!.value).toBe('Heredia');

    element.querySelector('form')!.dispatchEvent(new Event('submit', { cancelable: true }));
    await fixture.whenStable();
    expect(element.querySelector('#errorOrigen')).toBeNull();
    expect(navigate).toHaveBeenCalledWith(['/planificar/resultado'], {
      queryParams: expect.objectContaining({
        origen_lat: 9.9325,
        origen_lon: -84.0796,
        destino_lat: 9.9981,
        destino_lon: -84.117,
      }),
    });
  });
});

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
      { origin: 'Heredia', destination: 'San José' },
    ]);
    expect(TestBed.inject(Router).navigate).toHaveBeenCalledWith(['/planificar/resultado'], {
      queryParams: expect.objectContaining({
        origin: 'Heredia',
        destination: 'San José',
        tripId: expect.any(String),
      }),
    });
    element.querySelector<HTMLButtonElement>('#btnIntercambiar')!.click();
    await fixture.whenStable();
    element.querySelector<HTMLButtonElement>('app-item-busqueda-reciente button')!.click();
    await fixture.whenStable();
    expect(origin.value).toBe('Heredia');
    expect(destination.value).toBe('San José');
  });

  afterEach(() => localStorage.removeItem('trayectico-recent-searches'));
});

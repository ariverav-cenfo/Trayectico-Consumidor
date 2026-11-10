import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { vi } from 'vitest';
import { OrigenDestino } from './origen-destino';
import { ESPERA_BUSQUEDA_MS, PHOTON_URL } from '../../../../../services/geo/parametros-geo';

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

describe('OrigenDestino', () => {
  let fixture: ComponentFixture<OrigenDestino>;
  let element: HTMLElement;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrigenDestino],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(OrigenDestino);
    element = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  afterEach(() => http.verify());

  /** Escribe en el campo y espera a que salga la búsqueda a Photon. */
  async function escribir(campo: 'Origen' | 'Destino', texto: string): Promise<void> {
    const input = element.querySelector<HTMLInputElement>(`#txt${campo}`)!;
    input.value = texto;
    input.dispatchEvent(new Event('input'));
    await esperar(ESPERA_BUSQUEDA_MS + 50);
  }

  /** Responde la búsqueda pendiente de Photon para ese texto. */
  async function responder(texto: string, respuesta: object): Promise<void> {
    http
      .expectOne((req) => req.url === PHOTON_URL && req.params.get('q') === texto)
      .flush(respuesta);
    await fixture.whenStable();
  }

  /** Escribe, responde con un lugar y lo elige de la lista. */
  async function elegirLugar(
    campo: 'Origen' | 'Destino',
    nombre: string,
    lat: number,
    lon: number,
  ): Promise<void> {
    await escribir(campo, nombre);
    await responder(nombre, respuestaPhoton(nombre, lat, lon));
    element.querySelector<HTMLButtonElement>(`#lstSugerencias${campo} button`)!.click();
    await fixture.whenStable();
  }

  async function buscar(): Promise<void> {
    element.querySelector('form')!.dispatchEvent(new Event('submit', { cancelable: true }));
    await fixture.whenStable();
  }

  function mensaje(campo: 'Origen' | 'Destino'): string | null {
    return element.querySelector(`#error${campo}`)?.textContent?.trim() ?? null;
  }

  it('no muestra errores antes de intentar buscar', () => {
    expect(mensaje('Origen')).toBeNull();
    expect(mensaje('Destino')).toBeNull();
  });

  it('pide los dos campos al buscar vacío y no emite la búsqueda', async () => {
    const emitida = vi.fn();
    fixture.componentInstance.search.subscribe(emitida);
    await buscar();
    expect(mensaje('Origen')).toContain('Escriba el origen');
    expect(mensaje('Destino')).toContain('Escriba el destino');
    expect(element.querySelector('#txtOrigen')!.getAttribute('aria-invalid')).toBe('true');
    expect(emitida).not.toHaveBeenCalled();
  });

  it('no acepta una dirección escrita sin elegirla de las sugerencias', async () => {
    await escribir('Origen', 'Calle inventada');
    await responder('Calle inventada', { features: [] });
    await buscar();
    expect(mensaje('Origen')).toContain('No encontramos esa dirección');
  });

  it('avisa cuando el lugar está fuera de la GAM', async () => {
    await elegirLugar('Origen', 'Puntarenas', 9.9763, -84.8384);
    expect(mensaje('Origen')).toContain('fuera de la cobertura');
  });

  it('avisa cuando origen y destino son el mismo lugar', async () => {
    await elegirLugar('Origen', 'Hospital México', 9.9497, -84.1137);
    await elegirLugar('Destino', 'Hospital México', 9.9497, -84.1137);
    expect(mensaje('Destino')).toContain('mismo lugar');
  });

  it('avisa cuando Photon falla', async () => {
    await escribir('Origen', 'Hospital');
    http
      .expectOne((req) => req.url === PHOTON_URL)
      .flush('falla', { status: 503, statusText: 'Service Unavailable' });
    await fixture.whenStable();
    expect(mensaje('Origen')).toContain('No pudimos buscar direcciones');
  });

  it('emite la búsqueda con dos lugares válidos', async () => {
    const emitida = vi.fn();
    fixture.componentInstance.search.subscribe(emitida);
    await elegirLugar('Origen', 'San José', 9.9325, -84.0796);
    await elegirLugar('Destino', 'Heredia', 9.9981, -84.117);
    await buscar();
    expect(mensaje('Origen')).toBeNull();
    expect(mensaje('Destino')).toBeNull();
    expect(emitida).toHaveBeenCalledWith({ origin: 'San José', destination: 'Heredia' });
  });
});

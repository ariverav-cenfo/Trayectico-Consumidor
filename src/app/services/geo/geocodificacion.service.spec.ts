import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PHOTON_URL } from './parametros-geo';
import { GeocodificacionService } from './geocodificacion.service';
import { ResultadoBusqueda } from '../../interfaces/lugar';

/** Respuesta de Photon con un solo resultado: el Hospital México. */
const RESPUESTA_HOSPITAL = {
  features: [
    {
      geometry: { coordinates: [-84.1137, 9.9497] },
      properties: { name: 'Hospital México', district: 'La Uruca', city: 'San José', state: 'San José' },
    },
  ],
};

describe('GeocodificacionService', () => {
  let servicio: GeocodificacionService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    servicio = TestBed.inject(GeocodificacionService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Falla si quedó alguna petición sin responder o si hubo una de más.
    http.verify();
    vi.useRealTimers();
  });

  it('no consulta con menos de 3 letras', () => {
    let resultado: ResultadoBusqueda | undefined;
    servicio.buscar(' ho ').subscribe((r) => (resultado = r));
    expect(resultado).toEqual({ lugares: [], error: false });
  });

  it('consulta Photon limitado a la GAM y sin lang', () => {
    servicio.buscar('Hospital').subscribe();
    const peticion = http.expectOne((req) => req.url === PHOTON_URL);
    expect(peticion.request.params.get('q')).toBe('Hospital');
    expect(peticion.request.params.get('bbox')).toBe('-84.45,9.75,-83.75,10.15');
    expect(peticion.request.params.has('lang')).toBe(false);
    peticion.flush({ features: [] });
  });

  it('convierte el resultado y voltea [lon, lat] a { lat, lon }', () => {
    let resultado: ResultadoBusqueda | undefined;
    servicio.buscar('Hospital México').subscribe((r) => (resultado = r));
    http.expectOne((req) => req.url === PHOTON_URL).flush(RESPUESTA_HOSPITAL);

    expect(resultado?.error).toBe(false);
    expect(resultado?.lugares).toEqual([
      {
        nombre: 'Hospital México',
        detalle: 'La Uruca, San José',
        coordenada: { lat: 9.9497, lon: -84.1137 },
      },
    ]);
  });

  it('quita los lugares repetidos y deja el primero', () => {
    let resultado: ResultadoBusqueda | undefined;
    servicio.buscar('Hospital México').subscribe((r) => (resultado = r));
    const repetido = {
      geometry: { coordinates: [-84.1141, 9.9502] },
      properties: { name: 'Hospital México', district: 'La Uruca', city: 'San José', state: 'San José' },
    };
    http
      .expectOne((req) => req.url === PHOTON_URL)
      .flush({ features: [...RESPUESTA_HOSPITAL.features, repetido] });

    expect(resultado?.lugares.length).toBe(1);
    expect(resultado?.lugares[0].coordenada).toEqual({ lat: 9.9497, lon: -84.1137 });
  });

  it('descarta las líneas de bus', () => {
    let resultado: ResultadoBusqueda | undefined;
    servicio.buscar('Hospital México').subscribe((r) => (resultado = r));
    const lineaDeBus = {
      geometry: { coordinates: [-84.1, 9.94] },
      properties: { osm_key: 'route', name: 'Bus to Mexico Hospital', city: 'San José' },
    };
    http
      .expectOne((req) => req.url === PHOTON_URL)
      .flush({ features: [lineaDeBus, ...RESPUESTA_HOSPITAL.features] });

    expect(resultado?.lugares.map((lugar) => lugar.nombre)).toEqual(['Hospital México']);
  });

  it('devuelve lista vacía sin error cuando no encuentra nada', () => {
    let resultado: ResultadoBusqueda | undefined;
    servicio.buscar('xyzxyz').subscribe((r) => (resultado = r));
    http.expectOne((req) => req.url === PHOTON_URL).flush({ features: [] });
    expect(resultado).toEqual({ lugares: [], error: false });
  });

  it('marca error cuando Photon falla', () => {
    let resultado: ResultadoBusqueda | undefined;
    servicio.buscar('Hospital').subscribe((r) => (resultado = r));
    http
      .expectOne((req) => req.url === PHOTON_URL)
      .flush('falla', { status: 503, statusText: 'Service Unavailable' });
    expect(resultado).toEqual({ lugares: [], error: true });
  });

  it('sugerencias espera 300 ms y busca solo el último texto', () => {
    vi.useFakeTimers();
    const textos = new Subject<string>();
    textos.pipe(servicio.sugerencias()).subscribe();

    textos.next('Hos');
    vi.advanceTimersByTime(100);
    textos.next('Hosp');
    vi.advanceTimersByTime(299);
    http.expectNone((req) => req.url === PHOTON_URL);

    vi.advanceTimersByTime(1);
    const peticion = http.expectOne((req) => req.url === PHOTON_URL);
    expect(peticion.request.params.get('q')).toBe('Hosp');
    peticion.flush({ features: [] });
  });

  it('sugerencias no repite la búsqueda si el texto no cambió', () => {
    vi.useFakeTimers();
    const textos = new Subject<string>();
    textos.pipe(servicio.sugerencias()).subscribe();

    textos.next('Hospital');
    vi.advanceTimersByTime(300);
    http.expectOne((req) => req.url === PHOTON_URL).flush({ features: [] });

    textos.next('Hospital ');
    vi.advanceTimersByTime(300);
    http.expectNone((req) => req.url === PHOTON_URL);
  });
});

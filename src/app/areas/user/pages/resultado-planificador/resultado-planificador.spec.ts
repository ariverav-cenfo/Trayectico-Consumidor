import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { ResultadoPlanificador } from './resultado-planificador';
import { ViajeResponseDTO, TramoResponseDTO } from '../../../../interfaces/api-calculo-viaje';

const crearTramo = (
  tipo: 'bus' | 'caminata',
  codigoRuta?: string,
  pagoElectronico: boolean | null = null,
): TramoResponseDTO => ({
  tipo,
  distancia_metros: 500,
  geometria: {
    type: 'LineString',
    coordinates: [
      [-84.1218642, 9.990397],
      [-84.118, 9.988],
      [-84.115, 9.986],
    ],
  },
  codigo_ruta: codigoRuta,
  nombre_ruta: codigoRuta ? `Ruta ${codigoRuta}` : undefined,
  tarifa: tipo === 'bus' ? 250 : null,
  acepta_pago_electronico:
    tipo === 'bus' ? pagoElectronico : null,
});

const MOCK_VIAJE: ViajeResponseDTO = {
  opciones: [
    {
      transbordos: 0,
      distancia_caminando_metros: 300,
      costo_total: 250,
      tramos: [
        crearTramo('caminata'),
        crearTramo('bus', '0001', false),
        crearTramo('caminata'),
        crearTramo('bus', '0001', false),
      ],
    },
    {
      transbordos: 1,
      distancia_caminando_metros: 450,
      costo_total: 500,
      tramos: [
        crearTramo('caminata'),
        crearTramo('bus', '0002', true),
        crearTramo('caminata'),
        crearTramo('bus', '0003', true),
        crearTramo('caminata'),
      ],
    },
  ],
};


describe('ResultadoPlanificador', () => {
  let component: ResultadoPlanificador;
  let fixture: ComponentFixture<ResultadoPlanificador>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultadoPlanificador],
      providers: [
        provideRouter([
          { path: '', component: ResultadoPlanificador },
        ]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    
    httpMock = TestBed.inject(HttpTestingController);

    
    await TestBed.inject(Router).navigateByUrl(
      '/?origin=Hospital&destination=Paseo' +
        '&origen_lat=9.990397&origen_lon=-84.1218642' +
        '&destino_lat=9.9849782&destino_lon=-84.1113713',
    );

    
    fixture = TestBed.createComponent(ResultadoPlanificador);
    component = fixture.componentInstance;

    
    fixture.detectChanges();

    
    const req = httpMock.expectOne(
      'http://localhost:8080/api/rutas/buscar',
    );

    expect(req.request.method).toBe('POST');

    
    req.flush(MOCK_VIAJE);

    
    await fixture.whenStable();
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

it('updates the map, steps and payment when selecting another option', async () => {
  const element = fixture.nativeElement as HTMLElement;

  const options = element.querySelectorAll<HTMLButtonElement>(
    'app-resultados button',
  );

  expect(options.length).toBe(2);

  const firstPoints = element.querySelector('polyline')!.getAttribute('points');

  
  expect(
    element.querySelectorAll('app-paso-a-paso .step-item'),
  ).toHaveLength(4);

  
  expect(options[0].getAttribute('aria-pressed')).toBe('true');

 
  options[1].click();

  await fixture.whenStable();
  fixture.detectChanges();

  
  expect(options[1].getAttribute('aria-pressed')).toBe('true');
  expect(options[0].getAttribute('aria-pressed')).toBe('false');

  
  expect(
    element.querySelectorAll('app-paso-a-paso .step-item'),
  ).toHaveLength(5);

  
  expect(
    element.querySelector('polyline')!.getAttribute('points'),
  ).not.toBe(firstPoints);

  expect(element.querySelector('app-tarifa')!.textContent)
    .toContain('Acepta pago electronico');

  
  expect(
    element.querySelector('app-enlace-detalle-ruta a')!.getAttribute('href'),
  ).toBe('/rutas/0002');
});

  it('vuelve al planificador con los nombres y las coordenadas, sin el tripId', async () => {
    await TestBed.inject(Router).navigateByUrl(
      '/?origin=Hospital&destination=Paseo&tripId=abc' +
        '&origen_lat=9.990397&origen_lon=-84.1218642' +
        '&destino_lat=9.9849782&destino_lon=-84.1113713',
    );

    await fixture.whenStable();
    fixture.detectChanges();

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
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { ResultadoPlanificador } from './resultado-planificador';
import { ViajeResponseDTO, TramoResponseDTO } from '../../../../interfaces/api-calculo-viaje';
import { HistorialViajesService } from '../../../../services/historial-viajes.service';
import { environment } from '../../../../../environments/environment';


const URL_BUSCAR =  `${environment.apiUrl}/api/rutas/buscar`;

const COORDS =
  'origen_lat=9.990397&origen_lon=-84.1218642' +
  '&destino_lat=9.9849782&destino_lon=-84.1113713';

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
        `&${COORDS}`,
    );

    fixture = TestBed.createComponent(ResultadoPlanificador);
    component = fixture.componentInstance;

    fixture.detectChanges();

    const req = httpMock.expectOne(URL_BUSCAR);

    expect(req.request.method).toBe('POST');

    req.flush(MOCK_VIAJE);

    await fixture.whenStable();
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  async function crearOtro(query: string) {
    await TestBed.inject(Router).navigateByUrl(`/?${query}`);

    const otro = TestBed.createComponent(ResultadoPlanificador);
    otro.detectChanges();

    return otro;
  }

  async function estabilizar(
    f: ComponentFixture<ResultadoPlanificador>,
  ) {
    await f.whenStable();
    f.detectChanges();
  }

  const leerError = (
    f: ComponentFixture<ResultadoPlanificador>,
  ) =>
    (f.componentInstance as unknown as {
      error: () => string | null;
    }).error();


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('updates the map, steps and payment when selecting another option', async () => {
    const element = fixture.nativeElement as HTMLElement;

    const options = element.querySelectorAll<HTMLButtonElement>(
      'app-resultados button',
    );

    expect(options.length).toBe(2);

    const firstPoints = element
      .querySelector('polyline')!
      .getAttribute('points');

    expect(
      element.querySelectorAll('app-paso-a-paso .step-item'),
    ).toHaveLength(5);

    expect(options[0].getAttribute('aria-pressed')).toBe('true');

    options[1].click();

    await fixture.whenStable();
    fixture.detectChanges();

    expect(options[1].getAttribute('aria-pressed')).toBe('true');
    expect(options[0].getAttribute('aria-pressed')).toBe('false');

    expect(
      element.querySelectorAll('app-paso-a-paso .step-item'),
    ).toHaveLength(6);

    expect(
      element.querySelector('polyline')!.getAttribute('points'),
    ).not.toBe(firstPoints);

    expect(element.querySelector('app-tarifa')!.textContent)
      .toContain('Acepta pago electrónico');

    expect(
      element
        .querySelector('app-enlace-detalle-ruta a')!
        .getAttribute('href'),
    ).toBe('/rutas/0002');
  });

  it('vuelve al planificador con los nombres y las coordenadas, sin el tripId', async () => {
    await TestBed.inject(Router).navigateByUrl(
      '/?origin=Hospital&destination=Paseo&tripId=abc' +
        `&${COORDS}`,
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

  it('muestra "Información de pago no disponible" cuando el pago electrónico es desconocido', async () => {
    const otro = await crearOtro(COORDS);

    httpMock.expectOne(URL_BUSCAR).flush({
      opciones: [
        {
          transbordos: 0,
          distancia_caminando_metros: 100,
          costo_total: 250,
          tramos: [
            crearTramo('caminata'),
            crearTramo('bus', '0004'),
          ],
        },
      ],
    } satisfies ViajeResponseDTO);

    await estabilizar(otro);

    expect(otro.nativeElement.querySelector('app-tarifa').textContent)
      .toContain('Información de pago no disponible');
  });

  it('muestra el mensaje del backend cuando falla la búsqueda', async () => {
    const otro = await crearOtro(COORDS);

    httpMock
      .expectOne(URL_BUSCAR)
      .flush(
        { mensaje: 'Fuera de cobertura' },
        { status: 500, statusText: 'Server Error' },
      );

    await estabilizar(otro);

    expect(leerError(otro)).toBe('Fuera de cobertura');
  });

  it('usa el mensaje genérico cuando el error no trae cuerpo', async () => {
    const otro = await crearOtro(COORDS);

    httpMock
      .expectOne(URL_BUSCAR)
      .flush(
        null,
        { status: 500, statusText: 'Server Error' },
      );

    await estabilizar(otro);

    expect(leerError(otro)).toBe(
      'No se pudieron calcular las rutas.',
    );
  });

  it.each([
    ['sin coordenadas', 'origin=A&destination=B'],
    [
      'valor vacío',
      'origen_lat=&origen_lon=-84&destino_lat=9&destino_lon=-84',
    ],
    [
      'valor no numérico',
      'origen_lat=abc&origen_lon=-84&destino_lat=9&destino_lon=-84',
    ],
    [
      'falta una coordenada',
      'origen_lat=9.99&origen_lon=-84.12&destino_lat=9.98',
    ],
  ])(
    'no consulta el servicio y muestra error (%s)',
    async (_caso, query) => {
      const otro = await crearOtro(query);

      await estabilizar(otro);

      httpMock.expectNone(URL_BUSCAR);

      expect(leerError(otro)).toBe(
        'Faltan las coordenadas de origen o destino.',
      );
    },
  );

  it('actualiza el historial al elegir una opción cuando hay tripId', async () => {
    const actualizar = vi
      .spyOn(
        TestBed.inject(HistorialViajesService),
        'actualizarOpcion',
      )
      .mockImplementation(() => undefined as never);

    const otro = await crearOtro(`tripId=abc&${COORDS}`);

    httpMock.expectOne(URL_BUSCAR).flush(MOCK_VIAJE);

    await estabilizar(otro);

    otro.nativeElement
      .querySelectorAll('app-resultados button')[1]
      .click();

    expect(actualizar).toHaveBeenCalledWith('abc', 'opcion-1');
  });

  it('no toca el historial al elegir una opción sin tripId', async () => {
    const actualizar = vi
      .spyOn(
        TestBed.inject(HistorialViajesService),
        'actualizarOpcion',
      )
      .mockImplementation(() => undefined as never);

    const otro = await crearOtro(COORDS);

    httpMock.expectOne(URL_BUSCAR).flush(MOCK_VIAJE);

    await estabilizar(otro);

    otro.nativeElement
      .querySelectorAll('app-resultados button')[1]
      .click();

    expect(actualizar).not.toHaveBeenCalled();
  });
});

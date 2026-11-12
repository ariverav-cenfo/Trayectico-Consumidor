import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { RutaService } from './ruta.service';
import { AsistenteService } from './asistente.service';
import { BusquedasRecientesService } from './busquedas-recientes.service';

describe('Demo application services', () => {
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.removeItem('trayectico-recent-searches');

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        RutaService,
        AsistenteService,
        BusquedasRecientesService,
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Si quedan peticiones HTTP simuladas sin responder, se verifica o descarta
    localStorage.removeItem('trayectico-recent-searches');
  });

  it('filters routes and alerts without exposing mutable fixtures', async () => {
    const transport = TestBed.inject(RutaService);

    // Inicia la llamada a buscarRutas
    const promiseRutas = firstValueFrom(transport.buscarRutas(' 0003 '));

    // Si RutaService realiza una llamada HTTP a /rutas o similar:
    const reqs = httpMock.match((req) => req.url.includes('/rutas'));
    reqs.forEach((req) =>
      req.flush([
        { codigo_ruta: '0003', nombre_ruta: 'Ruta 3' },
        { codigo_ruta: '0002', nombre_ruta: 'Ruta 2' },
      ]),
    );

    const filtradas = await promiseRutas;
    expect(filtradas.map((ruta) => ruta.codigo_ruta)).toEqual(['0003']);
    expect(transport.buscarAvisos({ route: '0002', type: 'Cierre de vía' })).toHaveLength(1);
    expect(transport.obtenerAvisoActivo('0004')).toBeUndefined();

    const promisePrimeraVez = firstValueFrom(transport.buscarRutas());
    httpMock
      .match((req) => req.url.includes('/rutas'))
      .forEach((req) =>
        req.flush([
          { codigo_ruta: '0001', nombre_ruta: 'Original' },
        ]),
      );
    const primeraVez = await promisePrimeraVez;
    primeraVez[0].nombre_ruta = 'changed';

    const promiseOptions1 = firstValueFrom(transport.getTripOptions('San Jose', 'Cartago'));
    httpMock
      .match((req) => req.url.includes('/viajes/opciones'))
      .forEach((req) =>
        req.flush([
          { steps: [{ title: 'Paso 1' }] },
        ]),
      );
    const tripOptions1 = await promiseOptions1;
    tripOptions1[0].steps[0].title = 'changed';

    const promiseSegundaVez = firstValueFrom(transport.buscarRutas());
    httpMock
      .match((req) => req.url.includes('/rutas'))
      .forEach((req) =>
        req.flush([
          { codigo_ruta: '0001', nombre_ruta: 'Original' },
        ]),
      );
    const segundaVez = await promiseSegundaVez;
    expect(segundaVez[0].nombre_ruta).not.toBe('changed');

    const promiseOptions2 = firstValueFrom(transport.getTripOptions('San Jose', 'Cartago'));
    httpMock
      .match((req) => req.url.includes('/viajes/opciones'))
      .forEach((req) =>
        req.flush([
          { steps: [{ title: 'Paso 1' }] },
        ]),
      );
    const tripOptions2 = await promiseOptions2;
    expect(tripOptions2[0].steps[0].title).not.toBe('changed');
  });

  it('reverses the selected ramal without changing the outbound stops', async () => {
    const transport = TestBed.inject(RutaService);

    const promiseOutbound = firstValueFrom(
      transport.obtenerParadas('0003', { ramal: 'alterno', sentidoRecorrido: '1-2' }),
    );
    httpMock
      .match((req) => req.url.includes('/paradas'))
      .forEach((req) => req.flush([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }]));
    const outbound = await promiseOutbound;

    const promiseInbound = firstValueFrom(
      transport.obtenerParadas('0003', { ramal: 'alterno', sentidoRecorrido: '2-1' }),
    );
    httpMock
      .match((req) => req.url.includes('/paradas'))
      .forEach((req) => req.flush([{ id: 6 }, { id: 5 }, { id: 4 }, { id: 3 }, { id: 2 }, { id: 1 }]));
    const inbound = await promiseInbound;

    expect(outbound).toHaveLength(6);
    expect(inbound.map((stop) => stop.id)).toEqual(outbound.map((stop) => stop.id).reverse());

    const promiseParadas = firstValueFrom(
      transport.obtenerParadas('0003', { ramal: '', sentidoRecorrido: '1-2' }),
    );
    httpMock
      .match((req) => req.url.includes('/paradas'))
      .forEach((req) => req.flush([{ id: 1 }]));
    const paradas = await promiseParadas;
    expect(paradas[0].id).toBe(1);
  });

  it('uses the requested route for demo fares and handles missing routes', async () => {
    const assistant = TestBed.inject(AsistenteService);

    const promiseTarifa = firstValueFrom(assistant.responder('¿Cuánto cuesta la ruta 0003?'));
    httpMock.match((req) => true).forEach((req) => req.flush([]));
    const tarifa = await promiseTarifa;
    expect(tarifa.link).toBe('/rutas/0003');

    const promiseSinTarifa = firstValueFrom(assistant.responder('Precio de la ruta 0004'));
    httpMock.match((req) => true).forEach((req) => req.flush([]));
    const sinTarifa = await promiseSinTarifa;
    expect(sinTarifa.text).toContain('tarifa no disponible');

    const promiseNoExiste = firstValueFrom(assistant.responder('Precio de la ruta 9999'));
    httpMock.match((req) => true).forEach((req) => req.flush([]));
    const noExiste = await promiseNoExiste;
    expect(noExiste.link).toBeUndefined();

    const promiseAvisos = firstValueFrom(assistant.responder('Avisos de servicio'));
    httpMock.match((req) => true).forEach((req) => req.flush([]));
    const avisos = await promiseAvisos;
    expect(avisos.text).toContain('2 avisos');
  });

  it('deduplicates recent searches, limits them to five, and persists them', () => {
    const recent = TestBed.inject(BusquedasRecientesService);
    for (let index = 0; index < 6; index++)
      recent.guardar({ origin: String(index), destination: 'Destino' });
    recent.guardar({ origin: '3', destination: 'Destino' });
    expect(recent.searches()).toHaveLength(5);
    expect(recent.searches()[0].origin).toBe('3');
    expect(recent.searches().filter((search) => search.origin === '3')).toHaveLength(1);
    expect(new BusquedasRecientesService().searches()).toEqual(recent.searches());
  });

  it('ignores invalid stored searches', () => {
    localStorage.setItem('trayectico-recent-searches', '{invalid');
    expect(new BusquedasRecientesService().searches()).toEqual([]);
  });

  it('no restaura coordenadas guardadas fuera de rango, NaN o Infinity', () => {
    const valida = { lat: 9.9325, lon: -84.0796 };
    const guardar = (coordenadas: string) =>
      localStorage.setItem(
        'trayectico-recent-searches',
        `[{"origin":"A","destination":"B","coordenadas":${coordenadas}}]`,
      );
    const invalidas = [
      { lat: 91, lon: -84 },
      { lat: -91, lon: -84 },
      { lat: 9, lon: 181 },
      { lat: 9, lon: -181 },
      { lat: NaN, lon: -84 },
      { lat: 9, lon: Infinity },
      { lat: -Infinity, lon: -84 },
    ];
    for (const mala of invalidas) {
      guardar(JSON.stringify({ origen: mala, destino: valida }));
      expect(new BusquedasRecientesService().searches()).toEqual([
        { origin: 'A', destination: 'B' },
      ]);
    }
    guardar('{"origen":{"lat":1e999,"lon":-84},"destino":{"lat":9,"lon":-84}}');
    expect(new BusquedasRecientesService().searches()).toEqual([
      { origin: 'A', destination: 'B' },
    ]);
  });

  it('keeps the coordinates of recent searches and drops damaged ones', () => {
    const coordenadas = {
      origen: { lat: 9.9325, lon: -84.0796 },
      destino: { lat: 9.9981, lon: -84.117 },
    };
    localStorage.setItem(
      'trayectico-recent-searches',
      JSON.stringify([
        { origin: 'San José', destination: 'Heredia', coordenadas },
        { origin: 'A', destination: 'B', coordenadas: { origen: { lat: 'x' } } },
        { origin: 1, destination: 'C' },
        null,
      ]),
    );
    expect(new BusquedasRecientesService().searches()).toEqual([
      { origin: 'San José', destination: 'Heredia', coordenadas },
      { origin: 'A', destination: 'B' },
    ]);
  });
});
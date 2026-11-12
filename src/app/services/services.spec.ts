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

    // Avisos: datos de ejemplo, no hay petición HTTP.
    const avisosRuta = await firstValueFrom(
      transport.buscarAvisos({ route: '0002', type: 'Cierre de vía' }),
    );
    expect(avisosRuta).toHaveLength(1);
    expect(await firstValueFrom(transport.obtenerAvisoActivo('0004'))).toBeUndefined();
    expect((await firstValueFrom(transport.obtenerAvisoActivo('0002')))?.type).toBe('Cierre de vía');

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

    // Opciones de viaje: datos de ejemplo, copias independientes.
    const tripOptions1 = await firstValueFrom(transport.getTripOptions('San Jose', 'Cartago'));
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

    const tripOptions2 = await firstValueFrom(transport.getTripOptions('San Jose', 'Cartago'));
    expect(tripOptions2[0].steps[0].title).not.toBe('changed');
  });

  it('reverses the selected ramal without changing the outbound stops', async () => {
    const transport = TestBed.inject(RutaService);

    const outbound = await firstValueFrom(
      transport.obtenerParadas('0003', { ramal: 'alterno', sentidoRecorrido: '1-2' }),
    );
    const inbound = await firstValueFrom(
      transport.obtenerParadas('0003', { ramal: 'alterno', sentidoRecorrido: '2-1' }),
    );

    expect(outbound).toHaveLength(6);
    expect(inbound.map((stop) => stop.id)).toEqual(outbound.map((stop) => stop.id).reverse());

    const paradas = await firstValueFrom(
      transport.obtenerParadas('0003', { ramal: '', sentidoRecorrido: '1-2' }),
    );
    expect(paradas).toHaveLength(8);
  });

  it('uses the requested route for demo fares and handles missing routes', async () => {
    const assistant = TestBed.inject(AsistenteService);

    const promiseTarifa = firstValueFrom(assistant.responder('¿Cuánto cuesta la ruta 0003?'));
    httpMock
      .expectOne((req) => req.url.endsWith('/rutas/0003'))
      .flush({ codigo_ruta: '0003', nombre_ruta: 'Ruta 3' });
    const tarifa = await promiseTarifa;
    expect(tarifa.link).toBe('/rutas/0003');

    const promiseSinTarifa = firstValueFrom(assistant.responder('Precio de la ruta 0004'));
    httpMock
      .expectOne((req) => req.url.endsWith('/rutas/0004'))
      .flush({ codigo_ruta: '0004', nombre_ruta: 'Ruta 4' });
    const sinTarifa = await promiseSinTarifa;
    expect(sinTarifa.text).toContain('tarifa no disponible');

    const promiseNoExiste = firstValueFrom(assistant.responder('Precio de la ruta 9999'));
    httpMock
      .expectOne((req) => req.url.endsWith('/rutas/9999'))
      .flush(null, { status: 404, statusText: 'Not Found' });
    const noExiste = await promiseNoExiste;
    expect(noExiste.link).toBeUndefined();

    // Avisos: datos de ejemplo, no hay petición HTTP.
    const avisos = await firstValueFrom(assistant.responder('Avisos de servicio'));
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
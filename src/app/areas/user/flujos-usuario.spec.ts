import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { DetalleRuta } from './pages/detalle-ruta/detalle-ruta';
import { vi } from 'vitest';
import { Rutas } from './pages/rutas/rutas';
import { Avisos } from './pages/avisos/avisos';
import { Historial } from './pages/historial/historial';
import { HistorialViajesService } from '../../services/historial-viajes.service';
import { AVISOS_DEMO, PARADAS_DEMO, RUTAS_DEMO } from '../../data/datos-demo';

/** Respuesta del GET /rutas/{codigo}: la ruta con sus ramales, como la devuelve el backend. */
const RAMALES = [
  { codigo_ramal: 'principal', nombre_ramal: 'Principal', recorridos: [] },
  { codigo_ramal: 'alterno', nombre_ramal: 'Alterno', recorridos: [] },
];

/**
 * Responde todas las peticiones HTTP pendientes con los datos de ejemplo, filtrando
 * como lo haría el backend. Se llama después de cada acción que dispara peticiones.
 */
async function responderPeticiones(http: HttpTestingController, estable: { whenStable(): Promise<unknown> }) {
  // Las peticiones se emiten cuando los efectos de los signals ya corrieron.
  await estable.whenStable();
  for (const req of http.match(() => true)) {
    const { url, params } = req.request;
    const paradas = url.match(/\/rutas\/[^/]+\/paradas$/);
    const ruta = url.match(/\/rutas\/([^/]+)$/);
    if (url.endsWith('/avisos')) {
      const routeId = params.get('routeId');
      const type = params.get('type');
      req.flush(
        AVISOS_DEMO.filter(
          (aviso) => (!routeId || aviso.routeId === routeId) && (!type || aviso.type === type),
        ),
      );
    } else if (paradas) {
      const stops = params.get('ramal') === 'alterno' ? PARADAS_DEMO.slice(0, 6) : PARADAS_DEMO;
      req.flush(params.get('sentido') === '2-1' ? [...stops].reverse() : stops);
    } else if (url.endsWith('/geometria')) {
      req.flush('40,180 100,140 160,146 220,96 280,105 322,65');
    } else if (ruta) {
      const encontrada = RUTAS_DEMO.find((r) => r.codigo_ruta === ruta[1]);
      if (encontrada) req.flush({ ...encontrada, ramales: RAMALES });
      else req.flush(null, { status: 404, statusText: 'Not Found' });
    } else if (url.endsWith('/rutas')) {
      req.flush(RUTAS_DEMO);
    } else {
      req.error(new ProgressEvent('error'));
    }
  }
  await estable.whenStable();
}

const historyKey = 'trayectico-trip-history';

describe('User page interactions', () => {
  beforeEach(() => localStorage.removeItem(historyKey));
  afterEach(() => localStorage.removeItem(historyKey));

  it('expands stops and refreshes the alert and fare for another route', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: 'rutas/:id', component: DetalleRuta }]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    const http = TestBed.inject(HttpTestingController);
    const harness = await RouterTestingHarness.create('/rutas/0002');
    // GET /rutas/0002 y GET /avisos?routeId=0002
    await responderPeticiones(http, harness.fixture);
    let element = harness.routeNativeElement!;
    expect(element.querySelector('app-aviso-ruta')!.textContent).toContain('Cierre de vía');
    const ramal = element.querySelector<HTMLSelectElement>('#ramal-ruta')!;
    ramal.value = 'principal';
    ramal.dispatchEvent(new Event('change'));
    await responderPeticiones(http, harness.fixture);
    expect(element.querySelectorAll('app-paradas-ruta tbody tr')).toHaveLength(4);
    element.querySelector<HTMLButtonElement>('app-paradas-ruta button')!.click();
    await harness.fixture.whenStable();
    expect(element.querySelectorAll('app-paradas-ruta tbody tr')).toHaveLength(8);
    ramal.value = 'alterno';
    ramal.dispatchEvent(new Event('change'));
    await responderPeticiones(http, harness.fixture);
    expect(element.querySelectorAll('app-paradas-ruta tbody tr')).toHaveLength(6);
    await harness.navigateByUrl('/rutas/0003');
    await responderPeticiones(http, harness.fixture);
    element = harness.routeNativeElement!;
    expect(element.querySelector('app-aviso-ruta')!.textContent).toContain('Avería');
    expect(element.querySelector('app-tarifas-ruta')!.textContent).toContain('Tarifa no disponible');
    await harness.navigateByUrl('/rutas/0004');
    await responderPeticiones(http, harness.fixture);
    expect(harness.routeNativeElement!.querySelector('app-aviso-ruta')).toBeNull();
    expect(harness.routeNativeElement!.textContent).toContain('Tarifa no disponible');
  });

  it('loads more routes and filters by route code', async () => {
    TestBed.configureTestingModule({
      imports: [Rutas],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    const http = TestBed.inject(HttpTestingController);
    const fixture = TestBed.createComponent(Rutas);
    await responderPeticiones(http, fixture);
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelectorAll('app-tarjeta-ruta')).toHaveLength(4);
    element.querySelector<HTMLButtonElement>('app-lista-rutas button')!.click();
    await fixture.whenStable();
    expect(element.querySelectorAll('app-tarjeta-ruta')).toHaveLength(6);
    const search = element.querySelector<HTMLInputElement>('#route-search')!;
    search.value = '0003';
    search.dispatchEvent(new Event('input'));
    await responderPeticiones(http, fixture);
    expect(element.querySelectorAll('app-tarjeta-ruta')).toHaveLength(1);
    expect(element.querySelector('app-tarjeta-ruta a')!.getAttribute('href')).toBe('/rutas/0003');
    search.value = 'ruta inexistente';
    search.dispatchEvent(new Event('input'));
    await responderPeticiones(http, fixture);
    expect(element.textContent).toContain('No se encontraron rutas');
  });

  it('combines route and alert type filters, including the empty state', async () => {
    TestBed.configureTestingModule({
      imports: [Avisos],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    const http = TestBed.inject(HttpTestingController);
    const fixture = TestBed.createComponent(Avisos);
    await responderPeticiones(http, fixture);
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelectorAll('app-tarjeta-aviso')).toHaveLength(3);
    const route = element.querySelector<HTMLSelectElement>('#alert-route')!;
    route.value = '0002';
    route.dispatchEvent(new Event('change'));
    await responderPeticiones(http, fixture);
    expect(element.querySelectorAll('app-tarjeta-aviso')).toHaveLength(1);
    const type = element.querySelector<HTMLSelectElement>('#alert-type')!;
    type.value = 'Avería';
    type.dispatchEvent(new Event('change'));
    await responderPeticiones(http, fixture);
    expect(element.querySelectorAll('app-tarjeta-aviso')).toHaveLength(0);
    expect(element.textContent).toContain('No hay avisos');
  });

  it('requires explicit confirmation to clear history and persists the empty history', async () => {
    TestBed.configureTestingModule({
      imports: [Historial],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    const fixture = TestBed.createComponent(Historial);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const dialog = element.querySelector<HTMLDialogElement>('dialog')!;
    dialog.showModal = vi.fn();
    dialog.close = vi.fn();
    const store = TestBed.inject(HistorialViajesService);
    const clearButton = element.querySelector<HTMLButtonElement>('app-acciones-historial [data-variant="danger"]')!;
    clearButton.click();
    expect(dialog.showModal).toHaveBeenCalledOnce();
    expect(store.trips()).toHaveLength(3);
    dialog.querySelector<HTMLButtonElement>('[appButton]')!.click();
    expect(store.trips()).toHaveLength(3);
    clearButton.click();
    dialog.querySelector<HTMLButtonElement>('[data-variant="danger"]')!.click();
    await fixture.whenStable();
    expect(store.trips()).toHaveLength(0);
    expect(element.textContent).toContain('Todavía no tiene viajes guardados');
    expect(new HistorialViajesService().trips()).toEqual([]);
  });

  it('saves newest trips first, updates the selected option and removes individual trips', () => {
    const store = new HistorialViajesService();
    store.limpiar();
    const first = store.guardar('San José', 'Heredia', 'direct');
    const second = store.guardar('Heredia', 'Alajuela', 'transfer');
    expect(store.trips().map(trip => trip.id)).toEqual([second, first]);
    store.actualizarOpcion(first, 'transfer');
    expect(store.trips()[1].option).toBe('transfer');
    store.eliminar(second);
    expect(new HistorialViajesService().trips().map(trip => trip.id)).toEqual([first]);
  });
});
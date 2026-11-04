import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { DetalleRuta } from './pages/detalle-ruta/detalle-ruta';
import { vi } from 'vitest';
import { Rutas } from './pages/rutas/rutas';
import { Avisos } from './pages/avisos/avisos';
import { Historial } from './pages/historial/historial';
import { HistorialViajesService } from '../../services/historial-viajes.service';

const historyKey = 'trayectico-trip-history';

describe('User page interactions', () => {
  beforeEach(() => localStorage.removeItem(historyKey));
  afterEach(() => localStorage.removeItem(historyKey));

  it('expands stops and refreshes the alert and payment for another route', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter([{ path: 'rutas/:id', component: DetalleRuta }])] });
    const harness = await RouterTestingHarness.create('/rutas/0002');
    let element = harness.routeNativeElement!;
    expect(element.querySelector('app-aviso-ruta')!.textContent).toContain('Cierre de vía');
    expect(element.querySelectorAll('app-paradas-ruta tbody tr')).toHaveLength(4);
    element.querySelector<HTMLButtonElement>('app-paradas-ruta button')!.click();
    await harness.fixture.whenStable();
    expect(element.querySelectorAll('app-paradas-ruta tbody tr')).toHaveLength(8);
    const branch = element.querySelector<HTMLSelectElement>('#route-branch')!;
    branch.value = 'alterno';
    branch.dispatchEvent(new Event('change'));
    await harness.fixture.whenStable();
    expect(element.querySelectorAll('app-paradas-ruta tbody tr')).toHaveLength(6);
    await harness.navigateByUrl('/rutas/0003');
    element = harness.routeNativeElement!;
    expect(element.querySelector('app-aviso-ruta')!.textContent).toContain('Avería');
    expect(element.querySelector('app-payment-method')!.textContent).toContain('pago electrónico');
    await harness.navigateByUrl('/rutas/0004');
    expect(harness.routeNativeElement!.querySelector('app-aviso-ruta')).toBeNull();
    expect(harness.routeNativeElement!.textContent).toContain('Tarifa no disponible');
  });

  it('loads more routes and filters by route code', async () => {
    TestBed.configureTestingModule({ imports: [Rutas], providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(Rutas);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelectorAll('app-tarjeta-ruta')).toHaveLength(4);
    element.querySelector<HTMLButtonElement>('app-lista-rutas button')!.click();
    await fixture.whenStable();
    expect(element.querySelectorAll('app-tarjeta-ruta')).toHaveLength(6);
    const search = element.querySelector<HTMLInputElement>('#route-search')!;
    search.value = '0003';
    search.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(element.querySelectorAll('app-tarjeta-ruta')).toHaveLength(1);
    expect(element.querySelector('app-tarjeta-ruta a')!.getAttribute('href')).toBe('/rutas/0003');
    search.value = 'ruta inexistente';
    search.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(element.textContent).toContain('No se encontraron rutas');
  });

  it('combines route and alert type filters, including the empty state', async () => {
    TestBed.configureTestingModule({ imports: [Avisos], providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(Avisos);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelectorAll('app-tarjeta-aviso')).toHaveLength(3);
    const route = element.querySelector<HTMLSelectElement>('#alert-route')!;
    route.value = '0002';
    route.dispatchEvent(new Event('change'));
    await fixture.whenStable();
    expect(element.querySelectorAll('app-tarjeta-aviso')).toHaveLength(1);
    const type = element.querySelector<HTMLSelectElement>('#alert-type')!;
    type.value = 'Avería';
    type.dispatchEvent(new Event('change'));
    await fixture.whenStable();
    expect(element.querySelectorAll('app-tarjeta-aviso')).toHaveLength(0);
    expect(element.textContent).toContain('No hay avisos');
  });

  it('requires explicit confirmation to clear history and persists the empty history', async () => {
    TestBed.configureTestingModule({ imports: [Historial], providers: [provideRouter([])] });
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


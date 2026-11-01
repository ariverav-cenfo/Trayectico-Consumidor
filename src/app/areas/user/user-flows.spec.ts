import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { RouteDetail } from './pages/route-detail/route-detail';
import { vi } from 'vitest';
import { RoutesPage } from './pages/routes/routes';
import { ServiceAlerts } from './pages/service-alerts/service-alerts';
import { History } from './pages/history/history';
import { TripHistoryService } from '../../services/trip-history.service';

const historyKey = 'trayectico-trip-history';

describe('User page interactions', () => {
  beforeEach(() => localStorage.removeItem(historyKey));
  afterEach(() => localStorage.removeItem(historyKey));

  it('expands stops and refreshes the alert and payment for another route', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter([{ path: 'rutas/:id', component: RouteDetail }])] });
    const harness = await RouterTestingHarness.create('/rutas/0002');
    let element = harness.routeNativeElement!;
    expect(element.querySelector('app-route-alert')!.textContent).toContain('Cierre de vía');
    expect(element.querySelectorAll('app-route-stops tbody tr')).toHaveLength(4);
    element.querySelector<HTMLButtonElement>('app-route-stops button')!.click();
    await harness.fixture.whenStable();
    expect(element.querySelectorAll('app-route-stops tbody tr')).toHaveLength(8);
    const branch = element.querySelector<HTMLSelectElement>('#route-branch')!;
    branch.value = 'alterno';
    branch.dispatchEvent(new Event('change'));
    await harness.fixture.whenStable();
    expect(element.querySelectorAll('app-route-stops tbody tr')).toHaveLength(6);
    await harness.navigateByUrl('/rutas/0003');
    element = harness.routeNativeElement!;
    expect(element.querySelector('app-route-alert')!.textContent).toContain('Avería');
    expect(element.querySelector('app-payment-method')!.textContent).toContain('pago electrónico');
    await harness.navigateByUrl('/rutas/0004');
    expect(harness.routeNativeElement!.querySelector('app-route-alert')).toBeNull();
    expect(harness.routeNativeElement!.textContent).toContain('Tarifa no disponible');
  });

  it('loads more routes and filters by route code', async () => {
    TestBed.configureTestingModule({ imports: [RoutesPage], providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(RoutesPage);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelectorAll('app-route-card')).toHaveLength(4);
    element.querySelector<HTMLButtonElement>('app-route-list button')!.click();
    await fixture.whenStable();
    expect(element.querySelectorAll('app-route-card')).toHaveLength(6);
    const search = element.querySelector<HTMLInputElement>('#route-search')!;
    search.value = '0003';
    search.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(element.querySelectorAll('app-route-card')).toHaveLength(1);
    expect(element.querySelector('app-route-card a')!.getAttribute('href')).toBe('/rutas/0003');
    search.value = 'ruta inexistente';
    search.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(element.textContent).toContain('No se encontraron rutas');
  });

  it('combines route and alert type filters, including the empty state', async () => {
    TestBed.configureTestingModule({ imports: [ServiceAlerts], providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(ServiceAlerts);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelectorAll('app-alert-card')).toHaveLength(3);
    const route = element.querySelector<HTMLSelectElement>('#alert-route')!;
    route.value = '0002';
    route.dispatchEvent(new Event('change'));
    await fixture.whenStable();
    expect(element.querySelectorAll('app-alert-card')).toHaveLength(1);
    const type = element.querySelector<HTMLSelectElement>('#alert-type')!;
    type.value = 'Avería';
    type.dispatchEvent(new Event('change'));
    await fixture.whenStable();
    expect(element.querySelectorAll('app-alert-card')).toHaveLength(0);
    expect(element.textContent).toContain('No hay avisos');
  });

  it('requires explicit confirmation to clear history and persists the empty history', async () => {
    TestBed.configureTestingModule({ imports: [History], providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(History);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const dialog = element.querySelector<HTMLDialogElement>('dialog')!;
    dialog.showModal = vi.fn();
    dialog.close = vi.fn();
    const store = TestBed.inject(TripHistoryService);
    const clearButton = element.querySelector<HTMLButtonElement>('app-history-actions [data-variant="danger"]')!;
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
    expect(new TripHistoryService().trips()).toEqual([]);
  });

  it('saves newest trips first, updates the selected option and removes individual trips', () => {
    const store = new TripHistoryService();
    store.clear();
    const first = store.save('San José', 'Heredia', 'direct');
    const second = store.save('Heredia', 'Alajuela', 'transfer');
    expect(store.trips().map(trip => trip.id)).toEqual([second, first]);
    store.updateOption(first, 'transfer');
    expect(store.trips()[1].option).toBe('transfer');
    store.remove(second);
    expect(new TripHistoryService().trips().map(trip => trip.id)).toEqual([first]);
  });
});


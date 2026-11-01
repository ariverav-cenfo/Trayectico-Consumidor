import { TestBed } from '@angular/core/testing';
import { TransportService } from './transport.service';
import { AssistantService } from './assistant.service';
import { RecentSearchesService } from './recent-searches.service';

describe('Demo application services', () => {
  beforeEach(() => localStorage.removeItem('trayectico-recent-searches'));
  afterEach(() => localStorage.removeItem('trayectico-recent-searches'));

  it('filters routes and alerts without exposing mutable fixtures', () => {
    const transport = TestBed.inject(TransportService);
    expect(transport.getRoutes(' 0003 ').map((route) => route.id)).toEqual(['0003']);
    expect(transport.getAlerts({ route: '0002', type: 'Cierre de vía' })).toHaveLength(1);
    expect(transport.getActiveAlert('0004')).toBeUndefined();
    transport.getRoutes()[0].name = 'changed';
    transport.getTripOptions()[0].steps[0].title = 'changed';
    expect(transport.getRoutes()[0].name).not.toBe('changed');
    expect(transport.getTripOptions()[0].steps[0].title).not.toBe('changed');
  });

  it('reverses the selected branch without changing the outbound stops', () => {
    const transport = TestBed.inject(TransportService);
    const outbound = transport.getStops({ branch: 'alterno', direction: 'Ida' });
    const inbound = transport.getStops({ branch: 'alterno', direction: 'Regreso' });
    expect(outbound).toHaveLength(6);
    expect(inbound.map((stop) => stop.id)).toEqual(outbound.map((stop) => stop.id).reverse());
    expect(transport.getStops({ branch: '', direction: 'Ida' })[0].id).toBe(1);
  });

  it('uses the requested route for demo fares and handles missing routes', () => {
    const assistant = TestBed.inject(AssistantService);
    expect(assistant.reply('¿Cuánto cuesta la ruta 0003?').link).toBe('/rutas/0003');
    expect(assistant.reply('Precio de la ruta 0004').text).toContain('tarifa no disponible');
    expect(assistant.reply('Precio de la ruta 9999').link).toBeUndefined();
    expect(assistant.reply('Avisos de servicio').text).toContain('2 avisos');
  });

  it('deduplicates recent searches, limits them to five, and persists them', () => {
    const recent = TestBed.inject(RecentSearchesService);
    for (let index = 0; index < 6; index++)
      recent.save({ origin: String(index), destination: 'Destino' });
    recent.save({ origin: '3', destination: 'Destino' });
    expect(recent.searches()).toHaveLength(5);
    expect(recent.searches()[0].origin).toBe('3');
    expect(recent.searches().filter((search) => search.origin === '3')).toHaveLength(1);
    expect(new RecentSearchesService().searches()).toEqual(recent.searches());
  });

  it('ignores invalid stored searches', () => {
    localStorage.setItem('trayectico-recent-searches', '{invalid');
    expect(new RecentSearchesService().searches()).toEqual([]);
  });
});

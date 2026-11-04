import { TestBed } from '@angular/core/testing';
import { RutaService } from './ruta.service';
import { AsistenteService } from './asistente.service';
import { BusquedasRecientesService } from './busquedas-recientes.service';

describe('Demo application services', () => {
  beforeEach(() => localStorage.removeItem('trayectico-recent-searches'));
  afterEach(() => localStorage.removeItem('trayectico-recent-searches'));

  it('filters routes and alerts without exposing mutable fixtures', () => {
    const transport = TestBed.inject(RutaService);
    expect(transport.buscarRutas(' 0003 ').map((route) => route.codigo_ruta)).toEqual(['0003']);
    expect(transport.buscarAvisos({ route: '0002', type: 'Cierre de vía' })).toHaveLength(1);
    expect(transport.obtenerAvisoActivo('0004')).toBeUndefined();
    transport.buscarRutas()[0].nombre_ruta = 'changed';
    transport.getTripOptions()[0].steps[0].title = 'changed';
    expect(transport.buscarRutas()[0].nombre_ruta).not.toBe('changed');
    expect(transport.getTripOptions()[0].steps[0].title).not.toBe('changed');
  });

  it('reverses the selected branch without changing the outbound stops', () => {
    const transport = TestBed.inject(RutaService);
    const outbound = transport.obtenerParadas({ branch: 'alterno', direction: 'Ida' });
    const inbound = transport.obtenerParadas({ branch: 'alterno', direction: 'Regreso' });
    expect(outbound).toHaveLength(6);
    expect(inbound.map((stop) => stop.id)).toEqual(outbound.map((stop) => stop.id).reverse());
    expect(transport.obtenerParadas({ branch: '', direction: 'Ida' })[0].id).toBe(1);
  });

  it('uses the requested route for demo fares and handles missing routes', () => {
    const assistant = TestBed.inject(AsistenteService);
    expect(assistant.responder('¿Cuánto cuesta la ruta 0003?').link).toBe('/rutas/0003');
    expect(assistant.responder('Precio de la ruta 0004').text).toContain('tarifa no disponible');
    expect(assistant.responder('Precio de la ruta 9999').link).toBeUndefined();
    expect(assistant.responder('Avisos de servicio').text).toContain('2 avisos');
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
});

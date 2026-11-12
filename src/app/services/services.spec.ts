import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { RutaService } from './ruta.service';
import { AsistenteService } from './asistente.service';
import { BusquedasRecientesService } from './busquedas-recientes.service';

describe('Demo application services', () => {
  beforeEach(() => localStorage.removeItem('trayectico-recent-searches'));
  afterEach(() => localStorage.removeItem('trayectico-recent-searches'));

  it('filters routes and alerts without exposing mutable fixtures', async () => {
    const transport = TestBed.inject(RutaService);
    const filtradas = await firstValueFrom(transport.buscarRutas(' 0003 '));
    expect(filtradas.map((ruta) => ruta.codigo_ruta)).toEqual(['0003']);
    expect(transport.buscarAvisos({ route: '0002', type: 'Cierre de vía' })).toHaveLength(1);
    expect(transport.obtenerAvisoActivo('0004')).toBeUndefined();
    
    const primeraVez = await firstValueFrom(transport.buscarRutas());
    primeraVez[0].nombre_ruta = 'changed';
    
    const tripOptions1 = await firstValueFrom(transport.getTripOptions('San Jose', 'Cartago'));
    tripOptions1[0].steps[0].title = 'changed';
    
    const segundaVez = await firstValueFrom(transport.buscarRutas());
    expect(segundaVez[0].nombre_ruta).not.toBe('changed');
    
    const tripOptions2 = await firstValueFrom(transport.getTripOptions('San Jose', 'Cartago'));
    expect(tripOptions2[0].steps[0].title).not.toBe('changed');
  });

  it('reverses the selected ramal without changing the outbound stops', async () => {
    const transport = TestBed.inject(RutaService);
    
    const outbound = await firstValueFrom(transport.obtenerParadas('0003', { ramal: 'alterno', sentidoRecorrido: '1-2' }));
    const inbound = await firstValueFrom(transport.obtenerParadas('0003', { ramal: 'alterno', sentidoRecorrido: '2-1' }));
    
    expect(outbound).toHaveLength(6);
    expect(inbound.map((stop) => stop.id)).toEqual(outbound.map((stop) => stop.id).reverse());
    
    const paradas = await firstValueFrom(transport.obtenerParadas('0003', { ramal: '', sentidoRecorrido: '1-2' }));
    expect(paradas[0].id).toBe(1);
  });

  it('uses the requested route for demo fares and handles missing routes', async () => {
    const assistant = TestBed.inject(AsistenteService);
    const tarifa = await firstValueFrom(assistant.responder('¿Cuánto cuesta la ruta 0003?'));
    expect(tarifa.link).toBe('/rutas/0003');
    const sinTarifa = await firstValueFrom(assistant.responder('Precio de la ruta 0004'));
    expect(sinTarifa.text).toContain('tarifa no disponible');
    const noExiste = await firstValueFrom(assistant.responder('Precio de la ruta 9999'));
    expect(noExiste.link).toBeUndefined();
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
});
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';

describe('Area navigation', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
  });

  it.each([
    ['/', 'Planifique su viaje en bus'],
    ['/iniciar-sesion', 'Iniciar sesión'],
    ['/acceso-denegado', 'Acceso denegado'],
    ['/planificar', 'Planificar viaje'],
    ['/planificar/resultado', 'Resultados'],
    ['/rutas', 'Rutas'],
    ['/rutas/1', 'Ruta no encontrada'],
    ['/avisos', 'Avisos de servicio'],
    ['/historial', 'Historial de viajes'],
    ['/asistente', 'Asistente'],
    ['/perfil', 'Perfil'],
    ['/admin', 'admin-panel works!'],
    ['/admin/rutas', 'admin-rutas works!'],
    ['/admin/rutas/nueva', 'admin-formulario-ruta works!'],
    ['/admin/rutas/1', 'admin-formulario-ruta works!'],
    ['/admin/paradas', 'admin-paradas works!'],
    ['/admin/paradas/nueva', 'admin-formulario-parada works!'],
    ['/admin/paradas/1', 'admin-formulario-parada works!'],
    ['/admin/avisos', 'admin-avisos works!'],
    ['/admin/avisos/nuevo', 'admin-formulario-aviso works!'],
    ['/admin/avisos/1', 'admin-formulario-aviso works!'],
    ['/admin/tarifas', 'admin-tarifas works!'],
    ['/admin/usuarios', 'admin-usuarios works!'],
  ])('renders %s from its lazy area', async (url, text) => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(url);
    expect(harness.routeNativeElement?.textContent).toContain(text);
  });

  it.each([
    ['/', false],
    ['/iniciar-sesion', false],
    ['/pagina-no-encontrada', false],
    ['/acceso-denegado', false],
    ['/admin', false],
    ['/planificar', true],
    ['/rutas/1', true],
    ['/asistente', false],
    ['/perfil', true],
  ])('shows user navigation only in its area: %s', async (url, visible) => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(url as string);
    expect(!!harness.routeNativeElement?.querySelector('app-navigation-bar')).toBe(visible);
    await harness.navigateByUrl('/');
    expect(harness.routeNativeElement?.querySelector('app-navigation-bar')).toBeNull();
  });

  it.each(['/no-existe', '/admin/no-existe', '/login', '/registro', '/recuperar'])(
    'shows the public not-found page for %s',
    async (url) => {
      const harness = await RouterTestingHarness.create();
      await harness.navigateByUrl(url);
      expect(harness.routeNativeElement?.textContent).toContain('Página no encontrada');
      expect(TestBed.inject(Router).url).toBe('/pagina-no-encontrada');
    },
  );
});

import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { App } from './app';
import { routes } from './app.routes';
import { RolService } from './services/rol.service';

describe('Area navigation', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
    TestBed.inject(RolService).simular('admin');
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
    ['/admin', 'Panel administrador'],
    ['/admin/rutas', 'Habilita o deshabilita rutas'],
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

describe('Acceso a las áreas por rol', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
  });

  it.each([
    ['publico', '/', '/'],
    ['usuario', '/asistente', '/acceso-denegado'],
    ['admin', '/asistente', '/admin/rutas/nueva'],
  ] as const)('aplica los permisos de %s al navegar', async (rol, destinoUsuario, destinoAdmin) => {
    TestBed.inject(RolService).simular(rol);
    const harness = await RouterTestingHarness.create();
    const router = TestBed.inject(Router);

    await harness.navigateByUrl('/');
    expect(harness.routeNativeElement?.querySelector('app-inicio-sesion-google')).not.toBeNull();

    await harness.navigateByUrl('/asistente');
    expect(router.url).toBe(destinoUsuario);

    await harness.navigateByUrl('/admin/rutas/nueva');
    expect(router.url).toBe(destinoAdmin);
  });

  it('redirige al inicio una URL inexistente con rol publico mediante canMatch', async () => {
    TestBed.inject(RolService).simular('publico');
    const harness = await RouterTestingHarness.create();

    await harness.navigateByUrl('/no-existe');

    expect(TestBed.inject(Router).url).toBe('/');
    expect(harness.routeNativeElement?.textContent).toContain('Planifique su viaje en bus');
  });

  it('vuelve a comprobar la ruta actual cuando cambia el selector', async () => {
    TestBed.inject(RolService).simular('admin');
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/admin');
    expect(router.url).toBe('/admin');

    const selector: HTMLSelectElement = fixture.nativeElement.querySelector('#rol-simulado');
    selector.value = 'usuario';
    selector.dispatchEvent(new Event('change'));
    await fixture.whenStable();

    expect(router.url).toBe('/acceso-denegado');
  });
});

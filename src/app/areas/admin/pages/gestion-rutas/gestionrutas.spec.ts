import { Mock } from "vitest";
import { GestionRutasComponent } from "./gestionrutas";
import { RutaAdminDTO } from "../../../../interfaces/api-ruta-administracion";
import { TestBed } from "@angular/core/testing";
import { GestionRutaService } from "../../../../services/gestionrutas.service";
import { of, Subject, throwError } from "rxjs";
import { RouterTestingHarness } from "@angular/router/testing";
import { provideRouter } from "@angular/router";


describe('GestionRutasComponent', () => {
  let component: GestionRutasComponent;
  let serviceMock: { listarRutasAdmin: Mock; cambiarEstadoRuta: Mock };
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
 
  const mensajeErrorCarga =
    'No se pudieron cargar las rutas. Verifique su conexión o permisos.';
 
  const crearRuta = (cambios: Partial<RutaAdminDTO> = {}): RutaAdminDTO => ({
    id: 1,
    codigo_ctp: 'SJ-400',
    id_ctp: 1001,
    nombre: 'San José - Heredia',
    activo: true,
    recorridos: [],
    ...cambios,
  });
 
  const rutaHeredia = crearRuta();
  const rutaCartago = crearRuta({
    id: 2,
    codigo_ctp: 'CA-300',
    id_ctp: 2002,
    nombre: 'San José - Cartago',
    activo: false,
  });
  const rutaSinNombre = crearRuta({
    id: 3,
    codigo_ctp: 'AL-200',
    id_ctp: 3003,
    nombre: null,
    activo: true,
  });
  const rutas = [rutaHeredia, rutaCartago, rutaSinNombre];
 
  beforeEach(() => {
    serviceMock = {
      listarRutasAdmin: vi.fn().mockReturnValue(of(rutas)),
      cambiarEstadoRuta: vi.fn(),
    };
    // Evita ruido en la consola y permite verificar los registros de error
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
 
    TestBed.configureTestingModule({
      providers: [
        // La ruta permite resolver routerLink=".." en las pruebas de plantilla
        provideRouter([{ path: 'admin/rutas', component: GestionRutasComponent }]),
        { provide: GestionRutaService, useValue: serviceMock },
      ],
    });
 
    // Instancia sin plantilla para las pruebas de la lógica de la clase
    component = TestBed.runInInjectionContext(() => new GestionRutasComponent());
  });
 
  afterEach(() => {
    vi.restoreAllMocks();
  });
 
  describe('estado inicial', () => {
    it('debe crearse con los valores por defecto', () => {
      expect(component).toBeTruthy();
      expect(component.rutas()).toEqual([]);
      expect(component.filtro()).toBe('');
      expect(component.estadoFiltro()).toBe('todas');
      expect(component.cargando()).toBe(true);
      expect(component.error()).toBeNull();
      expect(component.actualizandoCodigo()).toBeNull();
      expect(component.rutaExpandida()).toBeNull();
    });
 
    it('no debe llamar al servicio antes de ngOnInit', () => {
      expect(serviceMock.listarRutasAdmin).not.toHaveBeenCalled();
    });
  });
 
  describe('ngOnInit', () => {
    it('debe cargar las rutas', () => {
      component.ngOnInit();
 
      expect(serviceMock.listarRutasAdmin).toHaveBeenCalledTimes(1);
      expect(component.rutas()).toEqual(rutas);
      expect(component.cargando()).toBe(false);
    });
  });
 
  describe('cargarRutas', () => {
    it('debe indicar que está cargando y limpiar el error mientras espera', () => {
      const respuesta$ = new Subject<RutaAdminDTO[]>();
      serviceMock.listarRutasAdmin.mockReturnValue(respuesta$);
      component.cargando.set(false);
      component.error.set('Error anterior');
 
      component.cargarRutas();
 
      expect(component.cargando()).toBe(true);
      expect(component.error()).toBeNull();
 
      respuesta$.next(rutas);
 
      expect(component.cargando()).toBe(false);
      expect(component.rutas()).toEqual(rutas);
    });
 
    it('debe mostrar un mensaje y registrar el error si la carga falla', () => {
      const fallo = new Error('fallo de red');
      serviceMock.listarRutasAdmin.mockReturnValue(throwError(() => fallo));
 
      component.cargarRutas();
 
      expect(component.error()).toBe(mensajeErrorCarga);
      expect(component.cargando()).toBe(false);
      expect(component.rutas()).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error al cargar rutas:', fallo);
    });
 
    it('debe conservar las rutas anteriores si una recarga falla', () => {
      component.cargarRutas();
      serviceMock.listarRutasAdmin.mockReturnValue(throwError(() => new Error()));
 
      component.cargarRutas();
 
      expect(component.rutas()).toEqual(rutas);
      expect(component.error()).toBe(mensajeErrorCarga);
    });
 
    it('debe recuperarse al reintentar después de un error', () => {
      serviceMock.listarRutasAdmin.mockReturnValueOnce(throwError(() => new Error()));
      component.cargarRutas();
 
      component.cargarRutas();
 
      expect(component.error()).toBeNull();
      expect(component.rutas()).toEqual(rutas);
      expect(component.cargando()).toBe(false);
    });
  });
 
  describe('rutasFiltradas', () => {
    beforeEach(() => component.rutas.set(rutas));
 
    it('debe devolver todas las rutas sin filtros', () => {
      expect(component.rutasFiltradas()).toEqual(rutas);
    });
 
    it('debe ignorar un texto que solo contiene espacios', () => {
      component.filtro.set('   ');
 
      expect(component.rutasFiltradas()).toEqual(rutas);
    });
 
    it('debe filtrar por código sin distinguir mayúsculas', () => {
      component.filtro.set('ca-3');
 
      expect(component.rutasFiltradas()).toEqual([rutaCartago]);
    });
 
    it('debe filtrar por nombre sin distinguir mayúsculas', () => {
      component.filtro.set('HEREDIA');
 
      expect(component.rutasFiltradas()).toEqual([rutaHeredia]);
    });
 
    it('debe filtrar por id_ctp', () => {
      component.filtro.set('3003');
 
      expect(component.rutasFiltradas()).toEqual([rutaSinNombre]);
    });
 
    it('debe recortar los espacios del texto de búsqueda', () => {
      component.filtro.set('  cartago  ');
 
      expect(component.rutasFiltradas()).toEqual([rutaCartago]);
    });
 
    it('debe devolver una lista vacía si nada coincide', () => {
      component.filtro.set('limón');
 
      expect(component.rutasFiltradas()).toEqual([]);
    });
 
    it('debe mostrar solo las rutas activas', () => {
      component.estadoFiltro.set('activas');
 
      expect(component.rutasFiltradas()).toEqual([rutaHeredia, rutaSinNombre]);
    });
 
    it('debe mostrar solo las rutas inactivas', () => {
      component.estadoFiltro.set('inactivas');
 
      expect(component.rutasFiltradas()).toEqual([rutaCartago]);
    });
 
    it('debe combinar el filtro de texto con el de estado', () => {
      component.filtro.set('san josé');
      component.estadoFiltro.set('activas');
 
      expect(component.rutasFiltradas()).toEqual([rutaHeredia]);
    });
 
    it('debe recalcularse cuando cambian las rutas', () => {
      component.estadoFiltro.set('inactivas');
      expect(component.rutasFiltradas()).toEqual([rutaCartago]);
 
      component.rutas.set([rutaHeredia]);
 
      expect(component.rutasFiltradas()).toEqual([]);
    });
  });
 
  describe('toggleEstadoRuta', () => {
    beforeEach(() => component.rutas.set(rutas));
 
    [rutaHeredia, rutaCartago].forEach((ruta) => {
      it(`debe solicitar activo=${!ruta.activo} para la ruta ${ruta.codigo_ctp}`, () => {
        serviceMock.cambiarEstadoRuta.mockReturnValue(
          of({ ...ruta, activo: !ruta.activo }),
        );
 
        component.toggleEstadoRuta(ruta);
 
        expect(serviceMock.cambiarEstadoRuta).toHaveBeenCalledWith(
          ruta.codigo_ctp,
          !ruta.activo,
        );
      });
    });
 
    it('debe marcar la ruta como en actualización hasta recibir la respuesta', () => {
      const respuesta$ = new Subject<RutaAdminDTO>();
      serviceMock.cambiarEstadoRuta.mockReturnValue(respuesta$);
 
      component.toggleEstadoRuta(rutaHeredia);
 
      expect(component.actualizandoCodigo()).toBe(rutaHeredia.codigo_ctp);
      // No hay actualización optimista
      expect(component.rutas()).toEqual(rutas);
 
      respuesta$.next({ ...rutaHeredia, activo: false });
 
      expect(component.actualizandoCodigo()).toBeNull();
    });
 
    it('debe reemplazar solo la ruta actualizada y mantener el orden', () => {
      const actualizada = { ...rutaCartago, activo: true };
      serviceMock.cambiarEstadoRuta.mockReturnValue(of(actualizada));
 
      component.toggleEstadoRuta(rutaCartago);
 
      expect(component.rutas()).toEqual([rutaHeredia, actualizada, rutaSinNombre]);
      expect(component.error()).toBeNull();
    });
 
    it('debe actualizar la lista filtrada tras cambiar el estado', () => {
      component.estadoFiltro.set('activas');
      serviceMock.cambiarEstadoRuta.mockReturnValue(
        of({ ...rutaHeredia, activo: false }),
      );
 
      component.toggleEstadoRuta(rutaHeredia);
 
      expect(component.rutasFiltradas()).toEqual([rutaSinNombre]);
    });
 
    it('debe ignorar la solicitud si ya hay una actualización en curso', () => {
      serviceMock.cambiarEstadoRuta.mockReturnValue(new Subject<RutaAdminDTO>());
      component.toggleEstadoRuta(rutaHeredia);
 
      component.toggleEstadoRuta(rutaCartago);
 
      expect(serviceMock.cambiarEstadoRuta).toHaveBeenCalledTimes(1);
      expect(component.actualizandoCodigo()).toBe(rutaHeredia.codigo_ctp);
    });
 
    it('debe mostrar y registrar el error sin modificar las rutas', () => {
      const fallo = new Error('fallo del servidor');
      serviceMock.cambiarEstadoRuta.mockReturnValue(throwError(() => fallo));
 
      component.toggleEstadoRuta(rutaHeredia);
 
      expect(component.error()).toBe(
        'Error al actualizar el estado de la ruta SJ-400.',
      );
      expect(component.rutas()).toEqual(rutas);
      expect(component.actualizandoCodigo()).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error al actualizar estado:', fallo);
    });
 
    it('debe permitir un nuevo intento después de un error', () => {
      serviceMock.cambiarEstadoRuta.mockReturnValueOnce(throwError(() => new Error()));
      serviceMock.cambiarEstadoRuta.mockReturnValueOnce(
        of({ ...rutaHeredia, activo: false }),
      );
 
      component.toggleEstadoRuta(rutaHeredia);
      component.toggleEstadoRuta(rutaHeredia);
 
      expect(serviceMock.cambiarEstadoRuta).toHaveBeenCalledTimes(2);
      expect(component.rutas()[0].activo).toBe(false);
    });
  });
 
  describe('toggleDetalles', () => {
    it('debe expandir una ruta', () => {
      component.toggleDetalles('SJ-400');
 
      expect(component.rutaExpandida()).toBe('SJ-400');
    });
 
    it('debe contraer la ruta si ya estaba expandida', () => {
      component.toggleDetalles('SJ-400');
      component.toggleDetalles('SJ-400');
 
      expect(component.rutaExpandida()).toBeNull();
    });
 
    it('debe cambiar la expansión a otra ruta', () => {
      component.toggleDetalles('SJ-400');
      component.toggleDetalles('CA-300');
 
      expect(component.rutaExpandida()).toBe('CA-300');
    });
  });
 
  describe('onBuscar', () => {
    const crearEvento = (value: string): Event => {
      const input = document.createElement('input');
      input.value = value;
      return { target: input } as unknown as Event;
    };
 
    it('debe asignar el valor del input al filtro sin modificarlo', () => {
      component.onBuscar(crearEvento('  Heredia '));
 
      expect(component.filtro()).toBe('  Heredia ');
    });
 
    it('debe filtrar las rutas con el valor ingresado', () => {
      component.rutas.set(rutas);
 
      component.onBuscar(crearEvento('cartago'));
 
      expect(component.rutasFiltradas()).toEqual([rutaCartago]);
    });
 
    it('debe restablecer la lista al vaciar el input', () => {
      component.rutas.set(rutas);
      component.onBuscar(crearEvento('cartago'));
 
      component.onBuscar(crearEvento(''));
 
      expect(component.rutasFiltradas()).toEqual(rutas);
    });
  });
 
  describe('plantilla', () => {
    let harness: RouterTestingHarness;
 
    const renderizar = async () => {
      harness = await RouterTestingHarness.create();
      await harness.navigateByUrl('/admin/rutas', GestionRutasComponent);
      harness.detectChanges();
    };
 
    const elemento = <T extends Element = HTMLElement>(selector: string) =>
      harness.routeNativeElement!.querySelector<T>(selector);
 
    const elementos = <T extends Element = HTMLElement>(selector: string) =>
      Array.from(harness.routeNativeElement!.querySelectorAll<T>(selector));
 
    const clic = (destino: HTMLElement) => {
      destino.click();
      harness.detectChanges();
    };
 
    it('debe enlazar de vuelta al panel', async () => {
      await renderizar();
 
      expect(elemento('.back-link')?.getAttribute('href')).toBe('/admin');
    });
 
    it('debe mostrar el estado de carga sin la tabla', async () => {
      serviceMock.listarRutasAdmin.mockReturnValue(new Subject<RutaAdminDTO[]>());
 
      await renderizar();
 
      expect(elemento('.loading-state')?.textContent).toContain('Cargando rutas...');
      expect(elemento('.rutas-table')).toBeNull();
    });
 
    it('debe mostrar el error y permitir reintentar', async () => {
      serviceMock.listarRutasAdmin.mockReturnValueOnce(throwError(() => new Error()));
      await renderizar();
      expect(elemento('[role="alert"]')?.textContent).toContain(mensajeErrorCarga);
 
      clic(elemento('.alert-error button')!);
 
      expect(elemento('[role="alert"]')).toBeNull();
      expect(elementos('tbody tr')).toHaveLength(3);
    });
 
    it('debe mostrar cada ruta y omitir el nombre si no existe', async () => {
      await renderizar();
 
      expect(elementos('tbody tr')).toHaveLength(3);
      expect(elementos('.route-name')).toHaveLength(2);
      expect(elementos('.filter-group button')[0].textContent).toContain('Todas (3)');
    });
 
    it('debe mostrar el estado y la acción de cada ruta', async () => {
      await renderizar();
 
      const insignias = elementos('.badge').map((e) => e.textContent?.trim());
      const acciones = elementos('.btn-toggle').map((e) => e.textContent?.trim());
 
      expect(insignias).toEqual(['Activa', 'Inactiva', 'Activa']);
      expect(acciones).toEqual(['Deshabilitar', 'Habilitar', 'Deshabilitar']);
    });
 
    it('debe filtrar al escribir en el buscador', async () => {
      await renderizar();
      const input = elemento<HTMLInputElement>('.search-input')!;
 
      input.value = 'cartago';
      input.dispatchEvent(new Event('input'));
      harness.detectChanges();
 
      expect(elementos('tbody tr')).toHaveLength(1);
      expect(elemento('tbody')?.textContent).toContain('CA-300');
    });
 
    it('debe filtrar por estado y marcar el botón seleccionado', async () => {
      await renderizar();
      const inactivas = elementos('.filter-group button')[2];
 
      clic(inactivas);
 
      expect(inactivas.classList).toContain('active');
      expect(elementos('tbody tr')).toHaveLength(1);
    });
 
    it('debe mostrar un mensaje si no hay rutas', async () => {
      serviceMock.listarRutasAdmin.mockReturnValue(of([]));
 
      await renderizar();
 
      expect(elemento('.empty-state')?.textContent).toContain('No se encontraron rutas');
    });
 
    it('debe bloquear el botón mientras guarda', async () => {
      serviceMock.cambiarEstadoRuta.mockReturnValue(new Subject<RutaAdminDTO>());
      await renderizar();
      const boton = elemento<HTMLButtonElement>('.btn-toggle')!;
 
      clic(boton);
 
      expect(serviceMock.cambiarEstadoRuta).toHaveBeenCalledWith('SJ-400', false);
      expect(boton.disabled).toBe(true);
      expect(boton.textContent).toContain('Guardando...');
    });
 
    it('debe expandir y contraer los detalles', async () => {
      await renderizar();
      const boton = elemento('.btn-link')!;
 
      clic(boton);
      expect(elemento('.recorridos-panel')?.textContent).toContain(
        'no tiene recorridos registrados',
      );
 
      clic(boton);
      expect(elemento('.recorridos-panel')).toBeNull();
    });
 
    it('debe listar los recorridos y mostrar N/A sin dirección', async () => {
      const recorrido = {
        id: 10,
        direccion: null,
        ramal_id: 7,
        longitud_m: 1500,
        estado_ctp: 'Autorizado',
        activo: true,
      } as unknown as RutaAdminDTO['recorridos'][number];
      serviceMock.listarRutasAdmin.mockReturnValue(
        of([crearRuta({ recorridos: [recorrido] })]),
      );
      await renderizar();
 
      clic(elemento('.btn-link')!);
 
      expect(elementos('.recorridos-list li')).toHaveLength(1);
      expect(elemento('.recorridos-list')?.textContent).toContain('N/A');
      expect(elemento('.recorridos-list')?.textContent).toContain('1500 m');
    });
  });
});
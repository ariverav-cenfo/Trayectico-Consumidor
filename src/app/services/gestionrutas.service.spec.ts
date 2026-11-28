import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { GestionRutaService } from './gestionrutas.service';
import { RutaAdminDTO } from '../interfaces/api-ruta-administracion';
 
describe('GestionRutaService', () => {
  let service: GestionRutaService;
  let httpMock: HttpTestingController;
 
  const apiUrl = '/api/admin/rutas';
 
  const crearRuta = (cambios: Partial<RutaAdminDTO> = {}): RutaAdminDTO => ({
    id: 1,
    codigo_ctp: '400',
    id_ctp: 1001,
    nombre: 'San José - Heredia',
    activo: true,
    recorridos: [
      {
        id: 10,
        ramal_id: 5,
        codigo_ctp: '400',
        id_ctp: 2001,
        direccion: 'IDA',
        longitud_m: 12500,
        estado_ctp: 'ACTIVO',
        activo: true,
      },
    ],
    ...cambios,
  });
 
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting(), provideHttpClientTesting()],
    });
 
    service = TestBed.inject(GestionRutaService);
    httpMock = TestBed.inject(HttpTestingController);
  });
 
  afterEach(() => {
    // Falla si quedan solicitudes pendientes o inesperadas
    httpMock.verify();
  });
 
  it('debe crearse', () => {
    expect(service).toBeTruthy();
  });
 
  describe('listarRutasAdmin', () => {
    it('debe hacer un GET y devolver la lista de rutas', () => {
      const rutas = [
        crearRuta(),
        crearRuta({ id: 2, codigo_ctp: '500', id_ctp: 1002, nombre: null, activo: false, recorridos: [] }),
      ];
      let resultado: RutaAdminDTO[] | undefined;
 
      service.listarRutasAdmin().subscribe((data) => (resultado = data));
 
      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(rutas);
 
      expect(resultado).toEqual(rutas);
    });
 
    it('debe devolver una lista vacía cuando no hay rutas', () => {
      let resultado: RutaAdminDTO[] | undefined;
 
      service.listarRutasAdmin().subscribe((data) => (resultado = data));
 
      httpMock.expectOne(apiUrl).flush([]);
 
      expect(resultado).toEqual([]);
    });
 
    it('no debe enviar la solicitud si nadie se suscribe', () => {
      service.listarRutasAdmin();
 
      httpMock.expectNone(apiUrl);
    });
 
    it('debe propagar el error del servidor', () => {
      let error: HttpErrorResponse | undefined;
 
      service.listarRutasAdmin().subscribe({
        next: () => {
          throw new Error('No se esperaba una respuesta exitosa');
        },
        error: (err: HttpErrorResponse) => (error = err),
      });
 
      httpMock
        .expectOne(apiUrl)
        .flush('Acceso denegado', { status: 403, statusText: 'Forbidden' });
 
      expect(error?.status).toBe(403);
      expect(error?.error).toBe('Acceso denegado');
    });
  });
 
  describe('obtenerRutaAdmin', () => {
    it('debe hacer un GET con el código y devolver la ruta', () => {
      const ruta = crearRuta();
      let resultado: RutaAdminDTO | undefined;
 
      service.obtenerRutaAdmin('400').subscribe((data) => (resultado = data));
 
      const req = httpMock.expectOne(`${apiUrl}/400`);
      expect(req.request.method).toBe('GET');
      req.flush(ruta);
 
      expect(resultado).toEqual(ruta);
    });
 
    it('debe codificar los caracteres especiales del código', () => {
      service.obtenerRutaAdmin('40 A/B?x#1').subscribe();
 
      const req = httpMock.expectOne(`${apiUrl}/40%20A%2FB%3Fx%231`);
      expect(req.request.method).toBe('GET');
      req.flush(crearRuta({ codigo_ctp: '40 A/B?x#1' }));
    });
 
    it('debe propagar un 404 cuando la ruta no existe', () => {
      let error: HttpErrorResponse | undefined;
 
      service.obtenerRutaAdmin('999').subscribe({
        next: () => {
          throw new Error('No se esperaba una respuesta exitosa');
        },
        error: (err: HttpErrorResponse) => (error = err),
      });
 
      httpMock
        .expectOne(`${apiUrl}/999`)
        .flush('Ruta no encontrada', { status: 404, statusText: 'Not Found' });
 
      expect(error?.status).toBe(404);
    });
  });
 
  describe('cambiarEstadoRuta', () => {
    [true, false].forEach((activo) => {
      it(`debe hacer un PATCH con activo=${activo} y devolver la ruta actualizada`, () => {
        const rutaActualizada = crearRuta({ activo });
        let resultado: RutaAdminDTO | undefined;
 
        service.cambiarEstadoRuta('400', activo).subscribe((data) => (resultado = data));
 
        const req = httpMock.expectOne(`${apiUrl}/400/estado`);
        expect(req.request.method).toBe('PATCH');
        expect(req.request.body).toEqual({ activo });
        req.flush(rutaActualizada);
 
        expect(resultado).toEqual(rutaActualizada);
      });
    });
 
    it('debe codificar los caracteres especiales del código', () => {
      service.cambiarEstadoRuta('40 A/B', false).subscribe();
 
      const req = httpMock.expectOne(`${apiUrl}/40%20A%2FB/estado`);
      expect(req.request.method).toBe('PATCH');
      req.flush(crearRuta({ codigo_ctp: '40 A/B', activo: false }));
    });
 
    it('debe propagar el error cuando falla la actualización', () => {
      let error: HttpErrorResponse | undefined;
 
      service.cambiarEstadoRuta('400', false).subscribe({
        next: () => {
          throw new Error('No se esperaba una respuesta exitosa');
        },
        error: (err: HttpErrorResponse) => (error = err),
      });
 
      httpMock
        .expectOne(`${apiUrl}/400/estado`)
        .flush('Error interno', { status: 500, statusText: 'Internal Server Error' });
 
      expect(error?.status).toBe(500);
    });
  });
});
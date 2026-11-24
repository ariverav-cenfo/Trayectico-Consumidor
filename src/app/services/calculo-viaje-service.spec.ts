import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {  HttpTestingController,  provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { CalculoViajeService } from './calculo-viaje.service';
import { environment } from '../../environments/environment';
import { ViajeRequestDTO } from '../interfaces/api-calculo-viaje';
import { ViajeResponseDTO } from '../interfaces/api-calculo-viaje';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';


describe('CalculoViajeService', () => {
  let service: CalculoViajeService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(CalculoViajeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('sends the request as a POST to /api/rutas/buscar', async () => {
const solicitud: ViajeRequestDTO = {
  origen: { lat: 9.9325, lon: -84.0796 },
  destino: { lat: 9.9981, lon: -84.117 },
};
const respuesta: ViajeResponseDTO = {
  opciones: [
    {
      transbordos: 0,
      distancia_caminando_metros: 120,
      costo_total: 350,
      tramos: [{ tipo: 'caminata', distancia_metros: 120, geometria: null }],
    },
  ],
};
    const promise = firstValueFrom(service.buscarViaje(solicitud));

    const req = httpMock.expectOne(`${environment.apiUrl}/api/rutas/buscar`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(solicitud);
    req.flush(respuesta);

    expect(await promise).toEqual(respuesta);
  });

  it('propagates HTTP errors to the caller', async () => {
    const promise = firstValueFrom(service.buscarViaje({} as ViajeRequestDTO));

    httpMock
      .expectOne(`${environment.apiUrl}/api/rutas/buscar`)
      .flush(null, { status: 500, statusText: 'Server Error' });

    await expect(promise).rejects.toMatchObject({ status: 500 });
  });

});
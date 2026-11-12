import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { Rutas } from './rutas';

describe('Rutas', () => {
  let component: Rutas;
  let fixture: ComponentFixture<Rutas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(), // Intercepta peticiones HTTP dentro de RutasComponent
      ],
      imports: [Rutas],
    }).compileComponents();

    fixture = TestBed.createComponent(Rutas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
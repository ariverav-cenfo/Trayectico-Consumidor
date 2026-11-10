import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DetalleRuta } from './detalle-ruta';

describe('DetalleRuta', () => {
  let component: DetalleRuta;
  let fixture: ComponentFixture<DetalleRuta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter([])],
      imports: [DetalleRuta],
    }).compileComponents();

    fixture = TestBed.createComponent(DetalleRuta);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

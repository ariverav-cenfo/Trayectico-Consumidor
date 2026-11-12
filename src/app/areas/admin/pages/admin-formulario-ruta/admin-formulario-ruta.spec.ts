import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminFormularioRuta } from './admin-formulario-ruta';

describe('AdminFormularioRuta', () => {
  let component: AdminFormularioRuta;
  let fixture: ComponentFixture<AdminFormularioRuta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminFormularioRuta],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminFormularioRuta);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

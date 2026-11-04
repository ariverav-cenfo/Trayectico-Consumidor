import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminFormularioParada } from './admin-formulario-parada';

describe('AdminFormularioParada', () => {
  let component: AdminFormularioParada;
  let fixture: ComponentFixture<AdminFormularioParada>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminFormularioParada],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminFormularioParada);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

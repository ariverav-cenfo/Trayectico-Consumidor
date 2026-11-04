import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminFormularioAviso } from './admin-formulario-aviso';

describe('AdminFormularioAviso', () => {
  let component: AdminFormularioAviso;
  let fixture: ComponentFixture<AdminFormularioAviso>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminFormularioAviso],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminFormularioAviso);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

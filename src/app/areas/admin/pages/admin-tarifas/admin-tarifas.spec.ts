import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminTarifas } from './admin-tarifas';

describe('AdminTarifas', () => {
  let component: AdminTarifas;
  let fixture: ComponentFixture<AdminTarifas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminTarifas],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminTarifas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

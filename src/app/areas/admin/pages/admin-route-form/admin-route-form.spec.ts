import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminRouteForm } from './admin-route-form';

describe('AdminRouteForm', () => {
  let component: AdminRouteForm;
  let fixture: ComponentFixture<AdminRouteForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRouteForm],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminRouteForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

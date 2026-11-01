import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminAlertForm } from './admin-alert-form';

describe('AdminAlertForm', () => {
  let component: AdminAlertForm;
  let fixture: ComponentFixture<AdminAlertForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAlertForm],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminAlertForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

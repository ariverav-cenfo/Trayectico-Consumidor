import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminStopForm } from './admin-stop-form';

describe('AdminStopForm', () => {
  let component: AdminStopForm;
  let fixture: ComponentFixture<AdminStopForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminStopForm],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminStopForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

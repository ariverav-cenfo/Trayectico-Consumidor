import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminStops } from './admin-stops';

describe('AdminStops', () => {
  let component: AdminStops;
  let fixture: ComponentFixture<AdminStops>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminStops],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminStops);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

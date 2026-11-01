import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminFares } from './admin-fares';

describe('AdminFares', () => {
  let component: AdminFares;
  let fixture: ComponentFixture<AdminFares>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminFares],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminFares);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

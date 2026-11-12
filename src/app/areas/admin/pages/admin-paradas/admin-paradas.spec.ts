import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminParadas } from './admin-paradas';

describe('AdminParadas', () => {
  let component: AdminParadas;
  let fixture: ComponentFixture<AdminParadas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminParadas],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminParadas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

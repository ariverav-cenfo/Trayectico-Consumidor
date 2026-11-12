import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminAvisos } from './admin-avisos';

describe('AdminAvisos', () => {
  let component: AdminAvisos;
  let fixture: ComponentFixture<AdminAvisos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAvisos],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminAvisos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

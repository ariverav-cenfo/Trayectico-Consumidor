import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServiceAlerts } from './service-alerts';

describe('ServiceAlerts', () => {
  let component: ServiceAlerts;
  let fixture: ComponentFixture<ServiceAlerts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceAlerts],
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceAlerts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

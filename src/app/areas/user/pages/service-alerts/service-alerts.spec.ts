import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ServiceAlerts } from './service-alerts';

describe('ServiceAlerts', () => {
  let component: ServiceAlerts;
  let fixture: ComponentFixture<ServiceAlerts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter([])],
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

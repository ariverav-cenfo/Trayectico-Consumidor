import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlannerResult } from './planner-result';
import { provideRouter } from '@angular/router';

describe('PlannerResult', () => {
  let component: PlannerResult;
  let fixture: ComponentFixture<PlannerResult>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlannerResult],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PlannerResult);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('updates the map, steps and payment when selecting another option', async () => {
    const element = fixture.nativeElement as HTMLElement;
    const options = element.querySelectorAll<HTMLButtonElement>('app-result-options button');
    const firstPoints = element.querySelector('polyline')!.getAttribute('points');
    expect(element.querySelectorAll('app-trip-step')).toHaveLength(4);
    expect(options[0].getAttribute('aria-pressed')).toBe('true');
    options[1].click();
    await fixture.whenStable();
    expect(options[1].getAttribute('aria-pressed')).toBe('true');
    expect(options[0].getAttribute('aria-pressed')).toBe('false');
    expect(element.querySelectorAll('app-trip-step')).toHaveLength(5);
    expect(element.querySelector('polyline')!.getAttribute('points')).not.toBe(firstPoints);
    expect(element.querySelector('app-fare')!.textContent).toContain('cada ruta');
    expect(element.querySelector('app-route-detail-link a')!.getAttribute('href')).toBe(
      '/rutas/0002',
    );
  });
});

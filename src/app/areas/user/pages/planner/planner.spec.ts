import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Planner } from './planner';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';

describe('Planner', () => {
  let component: Planner;
  let fixture: ComponentFixture<Planner>;

  beforeEach(async () => {
    localStorage.removeItem('trayectico-recent-searches');
    await TestBed.configureTestingModule({
      imports: [Planner],
      providers: [provideRouter([])],
    }).compileComponents();
    vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);

    fixture = TestBed.createComponent(Planner);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('swaps places and restores a recent search into the form', async () => {
    const element = fixture.nativeElement as HTMLElement;
    const origin = element.querySelector<HTMLInputElement>('#trip-origin')!;
    const destination = element.querySelector<HTMLInputElement>('#trip-destination')!;
    origin.value = 'San José';
    origin.dispatchEvent(new Event('input'));
    destination.value = 'Heredia';
    destination.dispatchEvent(new Event('input'));
    element.querySelector<HTMLButtonElement>('.swap')!.click();
    await fixture.whenStable();
    expect(origin.value).toBe('Heredia');
    expect(destination.value).toBe('San José');
    element.querySelector('form')!.dispatchEvent(new Event('submit', { cancelable: true }));
    await fixture.whenStable();
    expect(JSON.parse(localStorage.getItem('trayectico-recent-searches')!)).toEqual([
      { origin: 'Heredia', destination: 'San José' },
    ]);
    expect(TestBed.inject(Router).navigate).toHaveBeenCalledWith(['/planificar/resultado'], {
      queryParams: expect.objectContaining({
        origin: 'Heredia',
        destination: 'San José',
        tripId: expect.any(String),
      }),
    });
    element.querySelector<HTMLButtonElement>('.swap')!.click();
    await fixture.whenStable();
    element.querySelector<HTMLButtonElement>('app-recent-search-item button')!.click();
    await fixture.whenStable();
    expect(origin.value).toBe('Heredia');
    expect(destination.value).toBe('San José');
  });

  afterEach(() => localStorage.removeItem('trayectico-recent-searches'));
});

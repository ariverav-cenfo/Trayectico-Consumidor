import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouteDetail } from './route-detail';

describe('RouteDetail', () => {
  let component: RouteDetail;
  let fixture: ComponentFixture<RouteDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter([])],
      imports: [RouteDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(RouteDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

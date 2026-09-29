import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlannerResult } from './planner-result';

describe('PlannerResult', () => {
  let component: PlannerResult;
  let fixture: ComponentFixture<PlannerResult>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlannerResult],
    }).compileComponents();

    fixture = TestBed.createComponent(PlannerResult);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

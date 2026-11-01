import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Assistant } from './assistant';

describe('Assistant', () => {
  let component: Assistant;
  let fixture: ComponentFixture<Assistant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Assistant],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Assistant);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

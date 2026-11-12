import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, RouterLink } from '@angular/router';
import { Button } from './button';

@Component({
  imports: [Button, RouterLink],
  template: `
    <form (submit)="submitted = true; $event.preventDefault()">
      <button
        appButton
        type="submit"
        text="Guardar"
        size="small"
        variant="primary"
        [disabled]="disabled()"
      ></button>
    </form>
    <a appButton routerLink="/rutas" text="Ver rutas" [fullWidth]="false"></a>
    <button appButton type="button"><span>Contenido personalizado</span></button>
  `,
})
class ButtonHost {
  disabled = signal(true);
  submitted = false;
}

describe('Shared Button', () => {
  it('preserves native disabled and form submission behavior', async () => {
    TestBed.configureTestingModule({ imports: [ButtonHost], providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(ButtonHost);
    await fixture.whenStable();
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.textContent).toContain('Guardar');
    expect(button.dataset['size']).toBe('small');
    expect(button.dataset['variant']).toBe('primary');
    button.click();
    expect(fixture.componentInstance.submitted).toBe(false);
    fixture.componentInstance.disabled.set(false);
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();
    button.click();
    await fixture.whenStable();
    expect(button.disabled).toBe(false);
    expect(fixture.componentInstance.submitted).toBe(true);
  });

  it('preserves router links and projected content', async () => {
    TestBed.configureTestingModule({ imports: [ButtonHost], providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(ButtonHost);
    await fixture.whenStable();
    const link = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(link.getAttribute('href')).toBe('/rutas');
    expect(link.textContent).toContain('Ver rutas');
    expect(link.classList.contains('full-width')).toBe(false);
    expect(fixture.nativeElement.querySelector('button span').textContent).toBe(
      'Contenido personalizado',
    );
  });
});



import { TestBed } from '@angular/core/testing';
import { PwaService } from '../../../services/pwa.service';
import { PwaStatus } from './pwa-status';

describe('Instrucciones de instalación', () => {
  it('abre un diálogo y permite seguir usando la web sin instalar', async () => {
    const fixture = TestBed.createComponent(PwaStatus);
    const service = TestBed.inject(PwaService);
    const dialog = fixture.nativeElement.querySelector('dialog') as HTMLDialogElement;
    dialog.showModal = vi.fn(() => { dialog.open = true; });
    dialog.close = vi.fn(() => { dialog.open = false; });
    fixture.detectChanges();
    service.openHelp();
    await fixture.whenStable();
    expect(dialog.showModal).toHaveBeenCalledOnce();
    expect(dialog.textContent).toContain('Safari');
    expect(dialog.textContent).toContain('no está disponible');
    fixture.nativeElement.querySelector('.secondary').click();
    await fixture.whenStable();
    expect(service.helpOpen()).toBe(false);
    expect(dialog.close).toHaveBeenCalledOnce();
  });

  it('muestra el aviso sin conexión y lo retira al recuperar la red', async () => {
    const fixture = TestBed.createComponent(PwaStatus);
    fixture.detectChanges();
    window.dispatchEvent(new Event('offline'));
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.offline')?.textContent).toContain('Sin conexión');
    window.dispatchEvent(new Event('online'));
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.offline')).toBeNull();
  });
});

import { TestBed } from '@angular/core/testing';
import { InstallPromptEvent, PwaService } from './pwa.service';

describe('Instalación y conectividad de la PWA', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('actualiza el aviso al perder y recuperar la conexión', () => {
    const service = TestBed.inject(PwaService);
    window.dispatchEvent(new Event('offline'));
    expect(service.online()).toBe(false);
    window.dispatchEvent(new Event('online'));
    expect(service.online()).toBe(true);
  });

  it('conserva la solicitud del navegador y solo la utiliza una vez', async () => {
    const service = TestBed.inject(PwaService);
    const event = new Event('beforeinstallprompt', { cancelable: true }) as InstallPromptEvent;
    event.prompt = vi.fn().mockResolvedValue(undefined);
    event.userChoice = Promise.resolve({ outcome: 'dismissed' });
    window.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(service.available()).toBe(true);
    await service.install();
    await service.install();
    expect(event.prompt).toHaveBeenCalledTimes(1);
    expect(service.available()).toBe(false);
    expect(service.installed()).toBe(false);
    expect(service.message()).toContain('cancelada');
  });

  it('informa cuando el navegador no puede abrir la instalación', async () => {
    const service = TestBed.inject(PwaService);
    const event = new Event('beforeinstallprompt') as InstallPromptEvent;
    event.prompt = vi.fn().mockRejectedValue(new Error('Unavailable'));
    event.userChoice = Promise.resolve({ outcome: 'dismissed' });
    window.dispatchEvent(event);
    await service.install();
    expect(service.message()).toContain('No se pudo');
    expect(service.installing()).toBe(false);
  });

  it('reconoce la instalación completada por el navegador', () => {
    const service = TestBed.inject(PwaService);
    window.dispatchEvent(new Event('appinstalled'));
    expect(service.installed()).toBe(true);
    expect(service.available()).toBe(false);
  });

  it('permite abrir las instrucciones aunque no exista instalación directa', () => {
    const service = TestBed.inject(PwaService);
    service.openHelp();
    expect(service.available()).toBe(false);
    expect(service.helpOpen()).toBe(true);
  });
});

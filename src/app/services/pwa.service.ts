import { DestroyRef, Injectable, inject, signal } from '@angular/core';

export interface InstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

@Injectable({ providedIn: 'root' })
export class PwaService {
  readonly online = signal(navigator.onLine);
  readonly installed = signal(
    window.matchMedia?.('(display-mode: standalone)').matches === true ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true,
  );
  readonly available = signal(false);
  readonly helpOpen = signal(false);
  readonly installing = signal(false);
  readonly message = signal('');
  private deferredPrompt: InstallPromptEvent | null = null;

  constructor() {
    const listen = (name: string, listener: EventListener) => {
      window.addEventListener(name, listener);
      inject(DestroyRef).onDestroy(() => window.removeEventListener(name, listener));
    };
    listen('online', () => this.online.set(true));
    listen('offline', () => this.online.set(false));
    listen('beforeinstallprompt', (event) => {
      event.preventDefault();
      this.deferredPrompt = event as InstallPromptEvent;
      this.available.set(true);
      this.message.set('');
    });
    listen('appinstalled', () => {
      this.installed.set(true);
      this.available.set(false);
      this.deferredPrompt = null;
      this.message.set('Trayectico se instaló correctamente. Puede abrirlo desde sus aplicaciones.');
    });
  }

  openHelp() {
    this.message.set('');
    this.helpOpen.set(true);
  }

  async install() {
    const prompt = this.deferredPrompt;
    if (!prompt || this.installing()) return;
    this.deferredPrompt = null;
    this.available.set(false);
    this.installing.set(true);
    try {
      await prompt.prompt();
      const choice = await prompt.userChoice;
      this.message.set(choice.outcome === 'accepted'
        ? 'Solicitud aceptada. El navegador está completando la instalación.'
        : 'Instalación cancelada. Puede seguir usando Trayectico en el navegador.');
    } catch {
      this.message.set('No se pudo iniciar la instalación. Pruebe desde el menú del navegador o continúe usando la versión web.');
    } finally {
      this.installing.set(false);
    }
  }
}

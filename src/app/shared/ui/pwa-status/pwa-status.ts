import { Component, ElementRef, effect, inject, viewChild } from '@angular/core';
import { PwaService } from '../../../services/pwa.service';

@Component({
  selector: 'app-pwa-status',
  templateUrl: './pwa-status.html',
  styleUrl: './pwa-status.css',
})
export class PwaStatus {
  protected readonly pwa = inject(PwaService);
  private readonly dialog = viewChild<ElementRef<HTMLDialogElement>>('installDialog');

  constructor() {
    effect(() => {
      const dialog = this.dialog()?.nativeElement;
      if (!dialog) return;
      if (this.pwa.helpOpen() && !dialog.open) dialog.showModal();
      else if (!this.pwa.helpOpen() && dialog.open) dialog.close();
    });
  }

  protected closeBackdrop(event: MouseEvent, dialog: HTMLDialogElement) {
    if (event.target === dialog) this.pwa.helpOpen.set(false);
  }
}

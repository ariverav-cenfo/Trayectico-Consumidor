import { AsistenteService } from '../../../../services/asistente.service';
import type { MensajeAsistente } from '../../../../interfaces/mensaje-asistente';
import { Component, inject, signal } from '@angular/core';
import { EncabezadoAsistente } from '../../components/asistente/encabezado-asistente/encabezado-asistente';
import { NotaAsistente } from '../../components/asistente/nota-asistente/nota-asistente';
import { ConversacionAsistente } from '../../components/asistente/conversacion-asistente/conversacion-asistente';
import { EntradaAsistente } from '../../components/asistente/entrada-asistente/entrada-asistente';
@Component({
  imports: [EncabezadoAsistente, NotaAsistente, ConversacionAsistente, EntradaAsistente],
  selector: 'app-asistente',
  host: { class: 'user-area' },
  styleUrl: './asistente.css',
  templateUrl: './asistente.html',
})
export class Asistente {
  private readonly assistant = inject(AsistenteService);
  protected readonly messages = signal<MensajeAsistente[]>(this.assistant.mensajesIniciales());
  protected send(text: string) {
    this.messages.update((messages) => [
      ...messages,
      { id: messages.length + 1, role: 'user', text },
    ]);
    this.assistant.responder(text).subscribe((reply) => {
      this.messages.update((messages) => [
        ...messages,
        { id: messages.length + 1, role: 'assistant', ...reply },
      ]);
    });
  }
}

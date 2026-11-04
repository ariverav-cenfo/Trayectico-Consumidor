import { AssistantService } from '../../../../services/assistant.service';
import type { MensajeAsistente } from '../../../../interfaces/mensaje-asistente';
import { Component, inject, signal } from '@angular/core';
import { AssistantHeader } from '../../components/IA/assistant-header/assistant-header';
import { AssistantNotice } from '../../components/IA/assistant-notice/assistant-notice';
import { AssistantConversation } from '../../components/IA/assistant-conversation/assistant-conversation';
import { AssistantComposer } from '../../components/IA/assistant-composer/assistant-composer';
@Component({
  imports: [AssistantHeader, AssistantNotice, AssistantConversation, AssistantComposer],
  selector: 'app-assistant',
  host: { class: 'user-area' },
  styleUrl: './assistant.css',
  templateUrl: './assistant.html',
})
export class Assistant {
  private readonly assistant = inject(AssistantService);
  protected readonly messages = signal<MensajeAsistente[]>(this.assistant.initialMessages());
  protected send(text: string) {
    const reply = this.assistant.reply(text);
    this.messages.update((messages) => [
      ...messages,
      { id: messages.length + 1, role: 'user', text },
      { id: messages.length + 2, role: 'assistant', ...reply },
    ]);
  }
}

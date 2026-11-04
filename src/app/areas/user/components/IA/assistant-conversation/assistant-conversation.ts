import type { MensajeAsistente } from '../../../../../interfaces/mensaje-asistente';
import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UiIcon } from '../../../../../shared/ui/ui-icon/ui-icon';
@Component({
  selector: 'app-assistant-conversation',
  imports: [RouterLink, UiIcon],
  template: ` <div class="bubble">
      Hola. Puedo buscar rutas, consultar tarifas y revisar avisos de servicio. ¿Qué necesita?
    </div>
    <div class="suggestions" aria-label="Mensajes sugeridos">
      <button type="button" (click)="suggestion.emit('¿Cómo llego de [A] a [B]?')">
        ¿Cómo llego de [A] a [B]?
      </button>
      <button type="button" (click)="suggestion.emit('¿Cuánto cuesta la ruta 0002?')">
        ¿Cuánto cuesta la ruta 0002?
      </button>
    </div>
    <div
      class="messages"
      role="log"
      aria-label="Conversación con el asistente"
      aria-live="polite"
      aria-relevant="additions"
    >
      @for (message of messages(); track message.id) {
        <div class="bubble" [class.outgoing]="message.role === 'user'">
          <p>{{ message.text }}</p>
          @if (message.action) {
            <div class="action">
              <strong><app-ui-icon name="check" />Acción realizada</strong>
              <p>{{ message.action }}</p>
              <a [routerLink]="message.link">Ver resultado</a>
            </div>
          }
        </div>
      }
    </div>`,
  styleUrl: './assistant-conversation.css',
})
export class AssistantConversation {
  readonly messages = input.required<MensajeAsistente[]>();
  readonly suggestion = output<string>();
}

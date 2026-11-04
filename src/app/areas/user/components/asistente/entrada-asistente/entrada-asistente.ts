import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-entrada-asistente',
  imports: [FormsModule],
  template: `<form (ngSubmit)="submit()">
    <label for="assistant-message">Escriba su mensaje</label>
    <div class="compose">
      <input
        id="assistant-message"
        name="message"
        [(ngModel)]="draft"
        placeholder="Ejemplo: ¿Qué ruta pasa por [lugar]?"
        autocomplete="off"
      /><button type="submit" aria-label="Enviar mensaje" [disabled]="!draft.trim()">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m3 10 18-7-7 18-4-8-7-3Zm7 3L21 3" />
        </svg>
      </button>
    </div>
    <p>Las respuestas pueden tener errores. Verifique los datos en las pantallas.</p>
  </form>`,
  styles: `
    form {
      padding: 24px 32px 32px;
      border-top: 2px solid #c7d5d0;
      background: white;
    }
    label {
      display: block;
      font-size: 28px;
      font-weight: 700;
    }
    .compose {
      display: flex;
      gap: 16px;
      margin-top: 14px;
    }
    input {
      flex: 1;
      min-width: 0;
      width: 100%;
      margin: 0;
      height: 88px;
      font-size: 30px;
      padding: 16px 24px;
      border: 2px solid #c7d5d0;
      border-radius: 16px;
    }
    button {
      display: grid;
      place-items: center;
      flex-shrink: 0;
      width: 96px;
      border-radius: 16px;
      background: #1c3a34;
      color: white;
    }
    svg {
      width: 48px;
      height: 48px;
      fill: none;
      stroke: currentColor;
      stroke-width: 1.8;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    p {
      margin: 10px 0 0;
      color: #5d6e68;
      font-size: 28px;
      line-height: 1.4;
    }
    @media (max-width: 600px) {
      form {
        padding: 20px 16px;
      }
      label,
      p {
        font-size: 18px;
      }
      input {
        height: 58px;
        min-height: 58px;
        font-size: 18px;
        padding: 12px;
        border-radius: 12px;
      }
      button {
        width: 60px;
        border-radius: 12px;
      }
      svg {
        width: 32px;
        height: 32px;
      }
      .compose {
        gap: 10px;
      }
    }
  `,
})
export class EntradaAsistente {
  protected draft = '';
  readonly send = output<string>();
  protected submit() {
    const message = this.draft.trim();
    if (!message) return;
    this.send.emit(message);
    this.draft = '';
  }
}

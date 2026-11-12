import { Component, inject } from '@angular/core';
import { AiMessage } from '../../../../shared/ui/ai-message/ai-message';
import { HistorialViajesService } from '../../../../services/historial-viajes.service';
import { ListaViajes } from '../../components/historial/lista-viajes/lista-viajes';
import { AccionesHistorial } from '../../components/historial/acciones-historial/acciones-historial';
@Component({
  selector: 'app-historial',
  imports: [AiMessage, ListaViajes, AccionesHistorial],
  templateUrl: './historial.html',
  styleUrl: './historial.css',
})
export class Historial {
  protected readonly history = inject(HistorialViajesService);
}


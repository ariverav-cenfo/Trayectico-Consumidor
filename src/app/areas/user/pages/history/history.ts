import { Component, inject } from '@angular/core';
import { AiMessage } from '../../../../shared/ui/ai-message/ai-message';
import { HistorialViajesService } from '../../../../services/historial-viajes.service';
import { TripList } from '../../components/history/trip-list/trip-list';
import { HistoryActions } from '../../components/history/history-actions/history-actions';
@Component({
  selector: 'app-history',
  imports: [AiMessage, TripList, HistoryActions],
  templateUrl: './history.html',
  styleUrl: './history.css',
})
export class History {
  protected readonly history = inject(HistorialViajesService);
}


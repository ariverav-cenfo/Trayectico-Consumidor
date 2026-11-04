import { TransportService } from '../../../../services/transport.service';
import type { ValorFiltrosAvisos } from '../../../../interfaces/valor-filtros-avisos';
import { Component, inject, signal, computed } from '@angular/core';
import { AiMessage } from '../../../../shared/ui/ai-message/ai-message';
import { AlertFilters } from '../../components/service-alerts/alert-filters/alert-filters';
import { AlertList } from '../../components/service-alerts/alert-list/alert-list';
import { DataFooter } from '../../../../shared/layout/data-footer/data-footer';
@Component({
  selector: 'app-service-alerts',
  imports: [AiMessage, AlertFilters, AlertList, DataFooter],
  templateUrl: './service-alerts.html',
  styleUrl: './service-alerts.css',
})
export class ServiceAlerts {
  private readonly transport = inject(TransportService);
  protected readonly filters = signal<ValorFiltrosAvisos>({ route: '', type: '' });
  protected readonly alerts = computed(() => this.transport.getAlerts(this.filters()));
}

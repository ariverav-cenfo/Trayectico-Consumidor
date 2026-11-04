import { RutaService } from '../../../../services/ruta.service';
import { Component, inject, signal, computed } from '@angular/core';
import { AiMessage } from '../../../../shared/ui/ai-message/ai-message';
import { RouteSearch } from '../../components/routes/route-search/route-search';
import { RouteList } from '../../components/routes/route-list/route-list';
import { DataFooter } from '../../../../shared/layout/data-footer/data-footer';
@Component({
  selector: 'app-routes',
  imports: [AiMessage, RouteSearch, RouteList, DataFooter],
  templateUrl: './routes.html',
  styleUrl: './routes.css',
})
export class RoutesPage {
  private readonly transport = inject(RutaService);
  protected readonly routes = computed(() => this.transport.buscarRutas(this.query()));
  protected readonly query = signal('');
}

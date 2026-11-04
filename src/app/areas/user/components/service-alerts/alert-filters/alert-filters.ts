import { TransportService } from '../../../../../services/transport.service';
import type { ValorFiltrosAvisos } from '../../../../../interfaces/valor-filtros-avisos';
import { Component, inject, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-alert-filters',
  imports: [FormsModule],
  templateUrl: './alert-filters.html',
  styles: ':host { display: block; }',
})
export class AlertFilters {
  readonly change = output<ValorFiltrosAvisos>();
  protected readonly routes = inject(TransportService).getRoutes();
  protected route = '';
  protected type = '';
  protected emit() {
    this.change.emit({ route: this.route, type: this.type });
  }
}

import { RutaService } from '../../../../../services/ruta.service';
import type { ValorFiltrosAvisos } from '../../../../../interfaces/valor-filtros-avisos';
import { Component, inject, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-filtros-avisos',
  imports: [FormsModule],
  templateUrl: './filtros-avisos.html',
  styles: ':host { display: block; }',
})
export class FiltrosAvisos {
  readonly change = output<ValorFiltrosAvisos>();
  protected readonly routes = toSignal(inject(RutaService).buscarRutas(), { initialValue: [] });
  protected route = '';
  protected type = '';
  protected emit() {
    this.change.emit({ route: this.route, type: this.type });
  }
}

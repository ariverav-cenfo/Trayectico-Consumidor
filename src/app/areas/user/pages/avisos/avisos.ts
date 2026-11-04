import { RutaService } from '../../../../services/ruta.service';
import type { ValorFiltrosAvisos } from '../../../../interfaces/valor-filtros-avisos';
import { Component, inject, signal, computed } from '@angular/core';
import { AiMessage } from '../../../../shared/ui/ai-message/ai-message';
import { FiltrosAvisos } from '../../components/avisos/filtros-avisos/filtros-avisos';
import { ListaAvisos } from '../../components/avisos/lista-avisos/lista-avisos';
import { DataFooter } from '../../../../shared/layout/data-footer/data-footer';
@Component({
  selector: 'app-avisos',
  imports: [AiMessage, FiltrosAvisos, ListaAvisos, DataFooter],
  templateUrl: './avisos.html',
  styleUrl: './avisos.css',
})
export class Avisos {
  private readonly transport = inject(RutaService);
  protected readonly filters = signal<ValorFiltrosAvisos>({ route: '', type: '' });
  protected readonly alerts = computed(() => this.transport.buscarAvisos(this.filters()));
}

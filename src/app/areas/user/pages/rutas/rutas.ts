import { RutaService } from '../../../../services/ruta.service';
import { Component, inject, signal, computed } from '@angular/core';
import { AiMessage } from '../../../../shared/ui/ai-message/ai-message';
import { BuscadorRutas } from '../../components/rutas/buscador-rutas/buscador-rutas';
import { ListaRutas } from '../../components/rutas/lista-rutas/lista-rutas';
import { DataFooter } from '../../../../shared/layout/data-footer/data-footer';
@Component({
  selector: 'app-rutas',
  imports: [AiMessage, BuscadorRutas, ListaRutas, DataFooter],
  templateUrl: './rutas.html',
  styleUrl: './rutas.css',
})
export class Rutas {
  private readonly transport = inject(RutaService);
  protected readonly routes = computed(() => this.transport.buscarRutas(this.query()));
  protected readonly query = signal('');
}

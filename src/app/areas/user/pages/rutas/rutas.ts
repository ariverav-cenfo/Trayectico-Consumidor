import { RutaService } from '../../../../services/ruta.service';
import { Component, inject, signal } from '@angular/core';
import { AiMessage } from '../../../../shared/ui/ai-message/ai-message';
import { BuscadorRutas } from '../../components/rutas/buscador-rutas/buscador-rutas';
import { ListaRutas } from '../../components/rutas/lista-rutas/lista-rutas';
import { DataFooter } from '../../../../shared/layout/data-footer/data-footer';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-rutas',
  imports: [AiMessage, BuscadorRutas, ListaRutas, DataFooter],
  templateUrl: './rutas.html',
  styleUrl: './rutas.css',
})
export class Rutas {
  private readonly transport = inject(RutaService);
  protected readonly query = signal('');
  protected readonly routes = toSignal(
    toObservable(this.query).pipe(switchMap((query) => this.transport.buscarRutas(query))),
    { initialValue: [] },
  );
}

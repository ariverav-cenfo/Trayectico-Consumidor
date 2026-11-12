import { RutaService } from '../../../../services/ruta.service';
import { Component, inject, signal } from '@angular/core';
import { AiMessage } from '../../../../shared/ui/ai-message/ai-message';
import { BuscadorRutas } from '../../components/rutas/buscador-rutas/buscador-rutas';
import { ListaRutas } from '../../components/rutas/lista-rutas/lista-rutas';
import { DataFooter } from '../../../../shared/layout/data-footer/data-footer';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs';

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
    toObservable(this.query).pipe(
      switchMap((query) => 
        this.transport.buscarRutas().pipe(
          map(rutas=>{
            const termSrt = typeof query === 'string' ? query.trim().toLowerCase() : '';
            if (!termSrt)return rutas;
            return rutas.filter(ruta =>
            `${ruta.codigo_ruta} ${ruta.nombre_ruta}`.toLocaleLowerCase().includes(termSrt)
            );
          })
        ),
      ),
    ),
    { initialValue: [] },
  );
}

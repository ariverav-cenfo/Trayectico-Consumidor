import { Component, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap, catchError, of } from 'rxjs';

import { RutaService } from '../../../../services/ruta.service';
import type { ValorFiltrosAvisos } from '../../../../interfaces/valor-filtros-avisos';
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
  
  protected readonly alerts = toSignal(
    toObservable(this.filters).pipe(
      switchMap((filtros) => 
        this.transport.buscarAvisos(filtros).pipe(
          catchError((error) => {
            console.error('Error al cargar los avisos:', error);
            // Si el backend falla, devolvemos un arreglo vacío para no romper la vista
            return of([]); 
          })
        )
      )
    ),
    { initialValue: [] }
  );
}
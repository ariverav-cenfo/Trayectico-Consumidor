import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { catchError, of, switchMap, combineLatest } from 'rxjs';

import { RutaService } from '../../../../services/ruta.service';
import type { ValorControlesRuta } from '../../../../interfaces/valor-controles-ruta';
import { Button } from '../../../../shared/ui/button/button';
import { AiMessage } from '../../../../shared/ui/ai-message/ai-message';
import { EncabezadoRuta } from '../../components/detalle-ruta/encabezado-ruta/encabezado-ruta';
import { AvisoRuta } from '../../components/detalle-ruta/aviso-ruta/aviso-ruta';
import { ControlesRuta } from '../../components/detalle-ruta/controles-ruta/controles-ruta';
import { ParadasRuta } from '../../components/detalle-ruta/paradas-ruta/paradas-ruta';
import { TarifasRuta } from '../../components/detalle-ruta/tarifas-ruta/tarifas-ruta';
import { MapaResultado } from '../../components/resultado-planificador/mapa-resultado/mapa-resultado';
import { DataFooter } from '../../../../shared/layout/data-footer/data-footer';

@Component({
  selector: 'app-detalle-ruta',
  imports: [
    Button,
    AiMessage,
    RouterLink,
    EncabezadoRuta,
    AvisoRuta,
    ControlesRuta,
    ParadasRuta,
    TarifasRuta,
    MapaResultado,
    DataFooter,
  ],
  templateUrl: './detalle-ruta.html',
  styleUrl: './detalle-ruta.css',
})
export class DetalleRuta {
  private readonly transport = inject(RutaService);
  private readonly route = inject(ActivatedRoute);

  // Parámetros estáticos iniciales
  private readonly params = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap,
  });

  protected readonly controls = signal<ValorControlesRuta>({ ramal: '', sentidoRecorrido: '1-2' });

  // Petición de la ruta con manejo de error (devuelve undefined si falla)
  protected readonly current = toSignal(
    this.route.paramMap.pipe(
      switchMap((params) => 
        this.transport.obtenerRuta(params.get('id')).pipe(
          catchError(() => of(undefined))
        )
      )
    )
  );

  // Petición del aviso activo (depende del ID de la URL)
  protected readonly activeAlert = toSignal(
    this.route.paramMap.pipe(
      switchMap((params) =>
        this.transport.obtenerAvisoActivo(params.get('id')).pipe(
          catchError(() => of(undefined))
        )
      )
    ),
    { initialValue: undefined }
  );

  // Petición de las paradas
  protected readonly stops = toSignal(
    combineLatest([
      this.route.paramMap,
      toObservable(this.controls)
    ]).pipe(
      switchMap(([params, controls]) => {
        const id = params.get('id');
        // GUARDIA: Detiene la petición si no hay un id, ramal o sentido
        if (!id || !controls.ramal || !controls.sentidoRecorrido) {
          return of([]); 
        }
        return this.transport.obtenerParadas(id, controls).pipe(
          catchError(() => of([]))
        );
      })
    ),
    { initialValue: [] }
  );

  // Petición de los puntos del mapa
  protected readonly points = toSignal(
    combineLatest([
      this.route.paramMap,
      toObservable(this.controls)
    ]).pipe(
      switchMap(([params, controls]) => {
        const id = params.get('id');
        // GUARDIA: Detiene la petición si faltan datos
        if (!id || !controls.ramal || !controls.sentidoRecorrido) {
          return of('');
        }
        return this.transport.obtenerPuntosMapa(id, controls).pipe(
          catchError(() => of(''))
        );
      })
    ),
    { initialValue: '' }
  );
}
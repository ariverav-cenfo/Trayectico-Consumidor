import { RutaService } from '../../../../services/ruta.service';
import type { TripOption } from '../../../../interfaces/trip-option';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Resultados } from '../../components/resultado-planificador/resultados/resultados';

import { MapaResultado } from '../../components/resultado-planificador/mapa-resultado/mapa-resultado';
import { PasoAPaso } from '../../components/resultado-planificador/paso-a-paso/paso-a-paso';
import { Tarifa } from '../../components/resultado-planificador/tarifa/tarifa';
import { EnlaceDetalleRuta } from '../../components/resultado-planificador/enlace-detalle-ruta/enlace-detalle-ruta';
import { HistorialViajesService } from '../../../../services/historial-viajes.service';

import { AiMessage } from '../../../../shared/ui/ai-message/ai-message';

@Component({
  imports: [RouterLink, Resultados, MapaResultado, PasoAPaso, Tarifa, EnlaceDetalleRuta, AiMessage],
  selector: 'app-resultado-planificador',
  styleUrl: './resultado-planificador.css',
  templateUrl: './resultado-planificador.html',
})
export class ResultadoPlanificador {
  private readonly route = inject(ActivatedRoute);
  private readonly history = inject(HistorialViajesService);
  protected readonly params = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });
  protected readonly options = inject(RutaService).getTripOptions();
  protected readonly selected = signal(
    this.options.find((option) => option.id === this.route.snapshot.queryParamMap.get('option')) ??
      this.options[0],
  );
  protected choose(option: TripOption) {
    this.selected.set(option);
    const id = this.params().get('tripId');
    if (id) this.history.actualizarOpcion(id, option.id);
  }
}

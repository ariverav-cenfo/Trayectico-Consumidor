import { RutaService } from '../../../../services/ruta.service';
import type { TripOption } from '../../../../interfaces/trip-option';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Resultados } from '../../components/resultado-planificador/resultados/resultados';

import { MapaResultado } from '../../components/resultado-planificador/mapa-resultado/mapa-resultado';
import { PasoAPaso } from '../../components/resultado-planificador/paso-a-paso/paso-a-paso';
import { Tarifa } from '../../components/resultado-planificador/tarifa/tarifa';
import { EnlaceDetalleRuta } from '../../components/resultado-planificador/enlace-detalle-ruta/enlace-detalle-ruta';
import { HistorialViajesService } from '../../../../services/historial-viajes.service';

import { AiMessage } from '../../../../shared/ui/ai-message/ai-message';

/** Query params de la búsqueda que se devuelven al planificador: nombres y coordenadas. */
const PARAMS_BUSQUEDA = [
  'origin',
  'destination',
  'origen_lat',
  'origen_lon',
  'destino_lat',
  'destino_lon',
] as const;

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
  /**
   * Query params del enlace "Cambiar búsqueda". Llevan las coordenadas para que el
   * planificador restaure los lugares como reconocidos y no haya que elegirlos de nuevo.
   * Los que no vienen quedan en null y el router los omite.
   */
  protected readonly paramsCambiarBusqueda = computed(() => {
    const params = this.params();
    return Object.fromEntries(PARAMS_BUSQUEDA.map((nombre) => [nombre, params.get(nombre)]));
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

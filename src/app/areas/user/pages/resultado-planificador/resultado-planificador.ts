import { RutaService } from '../../../../services/ruta.service';
import type { TripOption } from '../../../../interfaces/trip-option';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of, switchMap } from 'rxjs';
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
  private readonly rutaService = inject(RutaService);

  protected readonly params = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });

  // Se actualiza automáticamente si cambian origen o destino en la URL
  protected readonly options = toSignal(
    this.route.queryParamMap.pipe(
      switchMap((queryParams) => {
        const origen = queryParams.get('origen') ?? '';
        const destino = queryParams.get('destino') ?? '';
        return this.rutaService.getTripOptions(origen, destino).pipe(
          catchError((error) => {
            console.error('Error cargando las opciones de viaje:', error);
            return of([] as TripOption[]);
          })
        );
      })
    ),
    { initialValue: [] as TripOption[] }
  );

  protected readonly selectedId = signal<string | null>(
    this.route.snapshot.queryParamMap.get('option')
  );

  protected readonly selected = computed(() => {
    const currentOptions = this.options();
    if (currentOptions.length === 0) return undefined;

    const id = this.selectedId();
    return currentOptions.find((opt) => opt.id === id) ?? currentOptions[0];
  });

  protected choose(option: TripOption) {
    this.selectedId.set(option.id);
    const tripId = this.params().get('tripId');
    if (tripId) this.history.actualizarOpcion(tripId, option.id);
  }
}
import { Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';

import { RutaService } from '../../../../services/ruta.service';
import type { TripOption } from '../../../../interfaces/trip-option';
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
  private readonly rutaService = inject(RutaService);

  protected readonly params = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });

  // 1. Extraemos origen y destino de la URL (ajusta los nombres de los parámetros si son distintos)
  private readonly origen = this.route.snapshot.queryParamMap.get('origen') ?? '';
  private readonly destino = this.route.snapshot.queryParamMap.get('destino') ?? '';

  // 2. Manejamos el error del Observable antes de convertirlo a Signal
  protected readonly options = toSignal(
    this.rutaService.getTripOptions(this.origen, this.destino).pipe(
      catchError((error) => {
        console.error('Error cargando las opciones de viaje:', error);
        return of([] as TripOption[]); // Retorna un array vacío si falla
      })
    ),
    { initialValue: [] as TripOption[] }
  );

  // 3. Guardamos solo el ID de selección.
  protected readonly selectedId = signal<string | null>(
    this.route.snapshot.queryParamMap.get('option')
  );

  // 4. Computamos la opción seleccionada reactivamente (seguro contra datos asíncronos)
  protected readonly selected = computed(() => {
    const currentOptions = this.options();
    if (currentOptions.length === 0) return undefined;
    
    const id = this.selectedId();
    return currentOptions.find((opt) => opt.id === id) ?? currentOptions[0];
  });

  protected choose(option: TripOption) {
    this.selectedId.set(option.id); // Actualizamos solo el ID
    const tripId = this.params().get('tripId');
    if (tripId) this.history.actualizarOpcion(tripId, option.id);
  }
}
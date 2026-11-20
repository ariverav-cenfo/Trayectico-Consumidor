import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { CalculoViajeService } from '../../../../services/calculo-viaje.service';
import { MapperBackendOpcionesViaje } from '../../../../utils/viaje-adapter';
import type { OpcionesViajeResponseDTO } from '../../../../interfaces/api-calculo-viaje';
import { Resultados } from '../../components/resultado-planificador/resultados/resultados';
import { MapaResultado } from '../../components/resultado-planificador/mapa-resultado/mapa-resultado';
import { PasoAPaso } from '../../components/resultado-planificador/paso-a-paso/paso-a-paso';
import { Tarifa } from '../../components/resultado-planificador/tarifa/tarifa';
import { EnlaceDetalleRuta } from '../../components/resultado-planificador/enlace-detalle-ruta/enlace-detalle-ruta';
import { HistorialViajesService } from '../../../../services/historial-viajes.service';
import { AiMessage } from '../../../../shared/ui/ai-message/ai-message';

const PARAMS_BUSQUEDA = [
  'origin',
  'destination',
  'origen_lat',
  'origen_lon',
  'destino_lon',
  'destino_lat',
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
  private readonly calculoViajeService = inject(CalculoViajeService);

  protected readonly params = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });

  protected readonly options = signal<OpcionesViajeResponseDTO[]>([]);
  protected readonly selected = signal<OpcionesViajeResponseDTO | null>(null);
  protected readonly cargando = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);

  protected readonly paramsCambiarBusqueda = computed(() => {
    const params = this.params();
    return Object.fromEntries(PARAMS_BUSQUEDA.map((nombre) => [nombre, params.get(nombre)]));
  });

  protected readonly PuntosSeleccion = computed(() => {
    const opt = this.selected();
    if (!opt) return '';
    return opt.tramos
      .flatMap((t) => t.geometria.coordinates.map(([lon, lat]) => `${lon},${lat}`))
      .join(' ');
  });

  protected readonly tarifaSeleccion = computed(() => {
    const costo = this.selected()?.costo_total;
    return costo !== null && costo !== undefined ? `₡${costo.toFixed(2)}` : 'Tarifa no disponible';
  });

  protected readonly MetodoSeleccion = computed(() => {
    const busTramos = this.selected()?.tramos.filter((t) => t.tipo === 'bus') ?? [];
    if (busTramos.length === 0) return 'No aplica';
    if (busTramos.every((t) => t.acepta_pago_electronico === true)) return 'Acepta pago electronico';
    if (busTramos.some((t) => t.acepta_pago_electronico === false)) return 'Solo efectivo en al menos un tramo';
    return 'Información de pago no disponible';
  });

  protected readonly IdRutaPrimaria = computed(() => {
    const firstBus = this.selected()?.tramos.find((t) => t.tipo === 'bus');
    return firstBus?.codigo_ruta ?? '';
  });

  constructor() {
    const snapshot = this.route.snapshot.queryParamMap;
    const origenLat = Number(snapshot.get('origen_lat'));
    const origenLon = Number(snapshot.get('origen_lon'));
    const destinoLon = Number(snapshot.get('destino_lon'));
    const destinoLat = Number(snapshot.get('destino_lat'));
    
    

    if (Number.isFinite(origenLat) && Number.isFinite(origenLon) &&
        Number.isFinite(destinoLon) && Number.isFinite(destinoLat)) {
      this.cargando.set(true);
      this.calculoViajeService
        .buscarViaje({
          origen: { lat: origenLat, lon: origenLon },
          destino: { lon: destinoLon, lat: destinoLat },
        })
        .subscribe({
          next: (res) => {
            const withIds: OpcionesViajeResponseDTO[] = res.opciones.map((op, idx) => ({
              ...op,
              id: `opcion-${idx}`,
            }));
            this.options.set(withIds);

            const preselectedId = snapshot.get('option');
            const initial = withIds.find((o) => o.id === preselectedId) ?? withIds[0] ?? null;
            this.selected.set(initial);
            this.cargando.set(false);
          },
          error: (err) => {
            this.error.set(err.error?.mensaje ?? 'No se pudieron calcular las rutas.');
            this.cargando.set(false);
          },
        });
    }
  }

  protected choose(option: OpcionesViajeResponseDTO) {
    this.selected.set(option);
    const id = this.params().get('tripId');
    if (id) {
      this.history.actualizarOpcion(id, option.id);
    }
  }


}
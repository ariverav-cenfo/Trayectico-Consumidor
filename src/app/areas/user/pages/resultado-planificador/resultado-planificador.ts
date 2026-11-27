import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { CalculoViajeService } from '../../../../services/calculo-viaje.service';
import type { OpcionesViajeResponseDTO, ViajeRequestDTO } from '../../../../interfaces/api-calculo-viaje';
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

/** Formato de colones costarricenses, por ejemplo "₡240,00" (igual que en el detalle de la ruta). */
const COLONES = new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' });

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
  /** Última búsqueda enviada; se reusa en "Reintentar". Es null si faltan coordenadas. */
  private solicitud: ViajeRequestDTO | null = null;

  protected readonly paramsCambiarBusqueda = computed(() => {
    const params = this.params();
    return Object.fromEntries(PARAMS_BUSQUEDA.map((nombre) => [nombre, params.get(nombre)]));
  });

  protected readonly PuntosSeleccion = computed(() => {
    const opt = this.selected();
    if (!opt) return '';
    return opt.tramos
      .flatMap((t) => (t.geometria?.coordinates ?? []).map(([lon, lat]) => `${lon},${lat}`))
      .join(' ');
  });

  protected readonly tarifaSeleccion = computed(() => {
    const costo = this.selected()?.costo_total;
    return costo !== null && costo !== undefined ? COLONES.format(costo) : 'Tarifa no disponible';
  });

  /** Explica por qué no hay total o por qué el total puede ser menor (RF-TP-04). */
  protected readonly notaTarifa = computed(() => {
    const busTramos = this.selected()?.tramos.filter((t) => t.tipo === 'bus') ?? [];
    if (busTramos.some((t) => t.tarifa === null || t.tarifa === undefined)) {
      return 'Al menos un tramo no tiene tarifa registrada en ARESEP, así que no se muestra un total.';
    }
    if (busTramos.some((t) => t.tarifa_exacta === false)) {
      return 'Incluye la tarifa de viaje completo de al menos un ramal; puede pagar menos según dónde suba y baje.';
    }
    return '';
  });

  protected readonly MetodoSeleccion = computed(() => {
    const busTramos = this.selected()?.tramos.filter((t) => t.tipo === 'bus') ?? [];
    if (busTramos.length === 0) return 'No aplica';
    if (busTramos.every((t) => t.acepta_pago_electronico === true)) return 'Acepta pago electrónico';
    if (busTramos.some((t) => t.acepta_pago_electronico === false)) return 'Solo efectivo en al menos un tramo';
    return 'Información de pago no disponible';
  });

  protected readonly IdRutaPrimaria = computed(() => {
    const firstBus = this.selected()?.tramos.find((t) => t.tipo === 'bus');
    return firstBus?.codigo_ruta ?? '';
  });

  constructor() {
    const snapshot = this.route.snapshot.queryParamMap;

    const leer = (nombre: string) => {
      const valor = snapshot.get(nombre);
      return valor === null || valor.trim() === '' ? NaN : Number(valor);
    };

    const origenLat = leer('origen_lat');
    const origenLon = leer('origen_lon');
    const destinoLon = leer('destino_lon');
    const destinoLat = leer('destino_lat');

    if (Number.isFinite(origenLat) && Number.isFinite(origenLon) &&
      Number.isFinite(destinoLon) && Number.isFinite(destinoLat)) {
      this.solicitud = {
        origen: { lat: origenLat, lon: origenLon },
        destino: { lon: destinoLon, lat: destinoLat },
      };
      this.buscar();
    } else {
      this.error.set('Faltan las coordenadas de origen o destino.');
    }
  }

  /** Indica si se puede volver a intentar la búsqueda (hay coordenadas válidas). */
  protected puedeReintentar(): boolean {
    return this.solicitud !== null;
  }

  /** Pide las opciones de viaje al Servidor. También lo usa el botón "Reintentar". */
  protected buscar() {
    if (!this.solicitud) return;
    const snapshot = this.route.snapshot.queryParamMap;
    this.error.set(null);
    this.cargando.set(true);
    this.calculoViajeService
      .buscarViaje(this.solicitud)
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

  protected choose(option: OpcionesViajeResponseDTO) {
    this.selected.set(option);
    const id = this.params().get('tripId');
    if (id) {
      this.history.actualizarOpcion(id, option.id);
    }
  }
}

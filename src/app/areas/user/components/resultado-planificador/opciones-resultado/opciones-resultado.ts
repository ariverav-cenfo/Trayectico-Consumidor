import { Component, computed, input, output } from '@angular/core';
import type { OpcionesViajeResponseDTO } from '../../../../../interfaces/api-calculo-viaje';

@Component({
  selector: 'app-opciones-resultado',
  templateUrl: './opciones-resultado.html',
  styleUrl: './opciones-resultado.css',
})
export class OpcionesResultado {
  readonly option = input.required<OpcionesViajeResponseDTO>();
  readonly selected = input(false);
  readonly choose = output<OpcionesViajeResponseDTO>();

  protected readonly title = computed(() => {
    const rutas = this.option()
      .tramos.filter((t) => t.tipo === 'bus' && t.codigo_ruta)
      .map((t) => t.codigo_ruta);
    return rutas.length > 0 ? `Ruta ${rutas.join(' → ')}` : 'Caminata directa';
  });

  protected readonly summary = computed(() => {
    const opt = this.option();
    const transbordos =
      opt.transbordos === 0
        ? 'Sin transbordos'
        : opt.transbordos === 1
          ? '1 transbordo'
          : `${opt.transbordos} transbordos`;
    return `${transbordos} · Caminata: ${opt.distancia_caminando_metros} m`;
  });

  protected readonly price = computed(() => {
    const costo = this.option().costo_total;
    return costo !== null && costo !== undefined ? `₡${costo.toFixed(2)}` : 'No disponible';
  });
}
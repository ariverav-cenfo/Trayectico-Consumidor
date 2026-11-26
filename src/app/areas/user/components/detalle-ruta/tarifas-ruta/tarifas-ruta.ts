import type { RutaConRamales } from '../../../../../interfaces/ruta';
import { Component, computed, input } from '@angular/core';

/** Formato de colones costarricenses, por ejemplo "₡240,00". */
const COLONES = new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' });

/**
 * Tarifas de ARESEP de cada ramal de la ruta (RF-TP-01). Si un ramal no tiene una tarifa
 * validada, muestra "Tarifa no disponible" en lugar de un monto.
 */
@Component({
  selector: 'app-tarifas-ruta',
  templateUrl: './tarifas-ruta.html',
  styles: ':host { display: block; }',
})
export class TarifasRuta {
  readonly route = input.required<RutaConRamales>();

  /** Indica si algún ramal muestra la tarifa del viaje completo en lugar de una tarifa exacta. */
  protected readonly hayTarifaViajeCompleto = computed(() =>
    this.route().ramales.some((ramal) => ramal.tarifa && !ramal.tarifa.exacta),
  );

  /**
   * Da formato de colones a un monto.
   *
   * @param monto Monto en colones.
   * @returns El monto con el símbolo y los separadores de Costa Rica.
   */
  protected formatearColones(monto: number): string {
    return COLONES.format(monto);
  }
}

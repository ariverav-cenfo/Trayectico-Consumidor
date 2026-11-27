import { Component, input } from '@angular/core';
import { TramoResponseDTO } from '../../../../../interfaces/api-calculo-viaje';

/** Formato de colones costarricenses, por ejemplo "₡240,00" (igual que en el detalle de la ruta). */
const COLONES = new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' });

@Component({
  selector: 'app-paso-a-paso',
  templateUrl: './paso-a-paso.html',
  styleUrl: './paso-a-paso.css',
})
export class PasoAPaso {
  readonly steps = input.required<TramoResponseDTO[]>();

  /**
   * Da formato de colones a la tarifa de un tramo.
   *
   * @param monto Monto en colones.
   * @returns El monto con el símbolo y los separadores de Costa Rica.
   */
  protected formatearColones(monto: number): string {
    return COLONES.format(monto);
  }
}

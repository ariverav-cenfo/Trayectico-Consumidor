import type { OpcionesViajeResponseDTO } from '../../../../../interfaces/api-calculo-viaje';
import { Component, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';


@Component({ 
  selector: 'app-resultados', 
  imports: [CurrencyPipe], 
  templateUrl: './resultados.html', 
  styleUrl: './resultados.css' })
export class Resultados {
  readonly options = input.required<OpcionesViajeResponseDTO[]>();
  readonly selectedId = input.required<string>();
  readonly choose = output<OpcionesViajeResponseDTO>();

  protected selectOption(option: OpcionesViajeResponseDTO): void{
    this.choose.emit(option);
  }

protected optionTitle(option: OpcionesViajeResponseDTO): string {
    const rutas = option.tramos
      .filter((t) => t.tipo === 'bus' && t.codigo_ruta)
      .map((t) => t.codigo_ruta);
    return rutas.length > 0 ? `Ruta ${rutas.join(' → ')}` : 'Caminata directa';
  }

  
  protected optionSummary(option: OpcionesViajeResponseDTO): string {
    const transbordosTexto =
      option.transbordos === 0
        ? 'Sin transbordos'
        : option.transbordos === 1
          ? '1 transbordo'
          : `${option.transbordos} transbordos`;
    return `${transbordosTexto} · Caminata: ${option.distancia_caminando_metros} m`;
  }

  protected price(option: OpcionesViajeResponseDTO): string {
    const costo = option.costo_total;
    return costo !== null && costo !== undefined ? `₡${costo.toFixed(2)}` : 'No disponible';
  }

}

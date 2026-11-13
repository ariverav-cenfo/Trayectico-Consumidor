import type { OpcionesViajeResponseDTO } from '../../../../../interfaces/api-calculo-viaje';
import { Component, input, output } from '@angular/core';
import { OpcionesResultado } from '../opciones-resultado/opciones-resultado';
import { CurrencyPipe } from '@angular/common';


@Component({ selector: 'app-resultados', 
  imports: [CurrencyPipe], 
  templateUrl: './resultados.html', 
  styleUrl: './resultados.css' })
export class Resultados {
  readonly options = input.required<OpcionesResultado[]>();
  readonly selectedId = input.required<string>();
  readonly choose = output<OpcionesViajeResponseDTO>();

  protected selectOption(option: OpcionesViajeResponseDTO): void{
    this.choose.emit(option);
  }

  protected routeSummary(option: OpcionesViajeResponseDTO): string{
    const busRoutes = option.tramos
    .filter((t) => t.tipo === 'bus' && t.codigo_ruta)
    .map((t) => t.codigo_ruta);
  return busRoutes.length > 0 ? `Ruta ${busRoutes.join(' → ')}` : 'Caminata directa';  
}

}

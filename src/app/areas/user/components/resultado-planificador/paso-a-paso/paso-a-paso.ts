import { Component, input } from '@angular/core';
import { TramoResponseDTO } from '../../../../../interfaces/api-calculo-viaje';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-paso-a-paso',
  imports: [CurrencyPipe],
  templateUrl: './paso-a-paso.html',
  styleUrl: './paso-a-paso.css',
})
export class PasoAPaso {
  readonly steps = input.required<TramoResponseDTO[]>();
}

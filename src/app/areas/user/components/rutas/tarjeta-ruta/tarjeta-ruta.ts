import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Ruta } from '../../../../../interfaces/ruta';
import { RutaService } from '../../../../../services/ruta.service';
import { UiIcon } from '../../../../../shared/ui/ui-icon/ui-icon';

@Component({
  selector: 'app-tarjeta-ruta',
  imports: [RouterLink, UiIcon],
  templateUrl: './tarjeta-ruta.html',
  styles: ':host { display: block; }',
})
export class TarjetaRuta {
  private readonly rutaService = inject(RutaService);
  readonly route = input.required<Ruta>();
  /** Aviso activo de la ruta, si existe; lo calcula desde los avisos y no desde la ruta. */
  readonly avisoActivo = computed(() =>
    this.rutaService.obtenerAvisoActivo(this.route().codigo_ruta),
  );
}

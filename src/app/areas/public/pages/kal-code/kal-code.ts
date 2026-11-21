import { Component, inject } from '@angular/core';
import { PwaService } from '../../../../services/pwa.service';
import { RouterLink } from '@angular/router';
import { HeaderAuth } from '../../../../shared/ui/header-auth/header-auth';

@Component({
  selector: 'app-kal-code',
  imports: [RouterLink, HeaderAuth],
  templateUrl: './kal-code.html',
  styleUrl: './kal-code.css',
})
export class KalCode {
  protected readonly pwa = inject(PwaService);
  protected readonly equipo = [
    { iniciales: 'IM', nombre: 'Isayana Murillo Calderón', cargo: 'Coordinadora general' },
    { iniciales: 'AR', nombre: 'Aarón Rivera Vindas', cargo: 'Coordinador de soporte' },
    { iniciales: 'CS', nombre: 'Christian Suncin Mora', cargo: 'Coordinador de desarrollo' },
    { iniciales: 'GG', nombre: 'Gabriel Guerrero Zamora', cargo: 'Coordinador de desarrollo' },
    { iniciales: 'EP', nombre: 'Efraín Pérez Castillo', cargo: 'Coordinador de calidad' },
  ];
}

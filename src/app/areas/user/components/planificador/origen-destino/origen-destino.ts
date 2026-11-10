import { Component, OnChanges, inject, input, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { map } from 'rxjs';
import type { BusquedaReciente } from '../../../../../interfaces/busqueda-reciente';
import type { Lugar, ResultadoBusqueda } from '../../../../../interfaces/lugar';
import { GeocodificacionService } from '../../../../../services/geo/geocodificacion.service';
import {
  dentroDeGamValidator,
  esLugar,
  lugarReconocidoValidator,
  origenDestinoDistintosValidator,
} from './validaciones-origen-destino';

/** Nombre de cada campo del formulario. */
type Campo = 'origen' | 'destino';

/** Lo que guarda cada campo: el texto que se está escribiendo o el lugar elegido. */
type ValorLugar = string | Lugar;

const SIN_SUGERENCIAS: ResultadoBusqueda = { lugares: [], error: false };

/** Texto que se muestra en el campo: lo escrito o el nombre del lugar elegido. */
function textoDe(valor: ValorLugar): string {
  return esLugar(valor) ? valor.nombre : valor;
}

@Component({
  selector: 'app-origen-destino',
  imports: [ReactiveFormsModule],
  templateUrl: './origen-destino.html',
  styleUrl: './origen-destino.css',
})
export class OrigenDestino implements OnChanges {
  private readonly geocodificacion = inject(GeocodificacionService);

  readonly initialSearch = input<BusquedaReciente | null>(null);
  readonly search = output<BusquedaReciente>();

  protected readonly formulario = new FormGroup(
    {
      origen: new FormControl<ValorLugar>('', {
        nonNullable: true,
        validators: [Validators.required, lugarReconocidoValidator, dentroDeGamValidator],
      }),
      destino: new FormControl<ValorLugar>('', {
        nonNullable: true,
        validators: [Validators.required, lugarReconocidoValidator, dentroDeGamValidator],
      }),
    },
    { validators: origenDestinoDistintosValidator() },
  );

  protected readonly sugerenciasOrigen = this.sugerenciasDe('origen');
  protected readonly sugerenciasDestino = this.sugerenciasDe('destino');

  ngOnChanges(): void {
    const seleccionada = this.initialSearch();
    if (seleccionada) {
      this.formulario.setValue({
        origen: seleccionada.origin,
        destino: seleccionada.destination,
      });
    }
  }

  /** Texto que muestra el campo. */
  protected texto(campo: Campo): string {
    return textoDe(this.formulario.controls[campo].value);
  }

  /** Indica si el campo ya tiene un lugar elegido; en ese caso no se muestran sugerencias. */
  protected tieneLugar(campo: Campo): boolean {
    return esLugar(this.formulario.controls[campo].value);
  }

  /**
   * Mensaje de error del campo, o null si no hay que mostrar ninguno.
   * El error del servicio se muestra de una vez; los de validación, después de intentar
   * buscar o de elegir un lugar, para no regañar mientras la persona todavía escribe.
   */
  protected mensajeError(campo: Campo): string | null {
    const sugerencias = campo === 'origen' ? this.sugerenciasOrigen() : this.sugerenciasDestino();
    if (!this.tieneLugar(campo) && sugerencias.error) {
      return 'No pudimos buscar direcciones. Revise su conexión e intente de nuevo.';
    }

    const control = this.formulario.controls[campo];
    if (!control.touched) {
      return null;
    }
    if (control.hasError('required')) {
      return `Escriba ${campo === 'origen' ? 'el origen' : 'el destino'} y elija una de las sugerencias.`;
    }
    if (control.hasError('lugarNoReconocido')) {
      return 'No encontramos esa dirección. Elija una de las sugerencias.';
    }
    if (control.hasError('fueraDeGam')) {
      return 'Ese lugar está fuera de la cobertura de Trayectico, que incluye solo la Gran Área Metropolitana.';
    }
    if (campo === 'destino' && this.formulario.hasError('mismoPunto')) {
      return 'El origen y el destino son el mismo lugar. Elija un destino diferente.';
    }
    return null;
  }

  /** Guarda lo que se escribe. Si había un lugar elegido, lo reemplaza el texto. */
  protected escribir(campo: Campo, evento: Event): void {
    const texto = (evento.target as HTMLInputElement).value;
    this.formulario.controls[campo].setValue(texto);
  }

  /** Guarda el lugar elegido de las sugerencias. */
  protected elegir(campo: Campo, lugar: Lugar): void {
    const control = this.formulario.controls[campo];
    control.setValue(lugar);
    control.markAsTouched();
  }

  protected intercambiar(): void {
    const { origen, destino } = this.formulario.getRawValue();
    this.formulario.setValue({ origen: destino, destino: origen });
  }

  protected buscar(): void {
    this.formulario.markAllAsTouched();
    if (this.formulario.invalid) {
      return;
    }
    const { origen, destino } = this.formulario.getRawValue();
    this.search.emit({ origin: textoDe(origen), destination: textoDe(destino) });
  }

  /** Sugerencias de Photon para un campo; con un lugar elegido, la lista queda vacía. */
  private sugerenciasDe(campo: Campo) {
    return toSignal(
      this.formulario.controls[campo].valueChanges.pipe(
        map((valor) => (esLugar(valor) ? '' : valor)),
        this.geocodificacion.sugerencias(),
      ),
      { initialValue: SIN_SUGERENCIAS },
    );
  }
}

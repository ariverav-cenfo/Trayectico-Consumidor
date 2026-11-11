import {
  Component,
  ElementRef,
  OnChanges,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { map } from 'rxjs';
import type { BusquedaReciente } from '../../../../../interfaces/busqueda-reciente';
import type { Coordenada, Lugar, ResultadoBusqueda } from '../../../../../interfaces/lugar';
import { GeocodificacionService } from '../../../../../services/geo/geocodificacion.service';
import {
  ErrorUbicacion,
  MotivoErrorUbicacion,
  NOMBRE_UBICACION_ACTUAL,
  UbicacionService,
} from '../../../../../services/geo/ubicacion.service';
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

/** Mensaje para cada motivo por el que el GPS no dio la ubicación. Todos piden escribir el origen. */
const MENSAJES_UBICACION: Record<MotivoErrorUbicacion, string> = {
  'permiso-denegado':
    'No tenemos permiso para usar su ubicación. Escriba el origen o active la ubicación en el navegador.',
  'no-disponible': 'No pudimos obtener su ubicación. Escriba el origen.',
  'tiempo-agotado': 'Su ubicación tardó demasiado en responder. Escriba el origen.',
  'no-soportado': 'Este navegador no permite usar la ubicación. Escriba el origen.',
};

/** Texto que se muestra en el campo: lo escrito o el nombre del lugar elegido. */
function textoDe(valor: ValorLugar): string {
  return esLugar(valor) ? valor.nombre : valor;
}

/**
 * Valor de un campo al restaurar una búsqueda guardada.
 * Con coordenadas vuelve como lugar reconocido; sin ellas, como texto para elegir de nuevo.
 * La ubicación del GPS no se restaura, porque la persona pudo haberse movido.
 */
function restaurar(nombre: string, coordenada: Coordenada | undefined): ValorLugar {
  if (nombre === NOMBRE_UBICACION_ACTUAL) {
    return '';
  }
  return coordenada ? { nombre, detalle: '', coordenada } : nombre;
}

@Component({
  selector: 'app-origen-destino',
  imports: [ReactiveFormsModule],
  templateUrl: './origen-destino.html',
  styleUrl: './origen-destino.css',
})
export class OrigenDestino implements OnChanges {
  private readonly geocodificacion = inject(GeocodificacionService);
  private readonly ubicacion = inject(UbicacionService);
  private readonly campoOrigen = viewChild.required<ElementRef<HTMLInputElement>>('campoOrigen');

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

  /** True mientras se espera la respuesta del GPS. */
  protected readonly ubicando = signal(false);
  /** Motivo del último fallo del GPS; se limpia al escribir o elegir otro origen. */
  private readonly errorUbicacion = signal<MotivoErrorUbicacion | null>(null);

  ngOnChanges(): void {
    const seleccionada = this.initialSearch();
    if (seleccionada) {
      const { origin, destination, coordenadas } = seleccionada;
      this.errorUbicacion.set(null);
      this.formulario.setValue({
        origen: restaurar(origin, coordenadas?.origen),
        destino: restaurar(destination, coordenadas?.destino),
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
   * Los errores del GPS y del servicio se muestran de una vez; los de validación, después de
   * intentar buscar o de elegir un lugar, para no regañar mientras la persona todavía escribe.
   */
  protected mensajeError(campo: Campo): string | null {
    const motivoUbicacion = this.errorUbicacion();
    if (campo === 'origen' && motivoUbicacion) {
      return MENSAJES_UBICACION[motivoUbicacion];
    }

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
    if (campo === 'origen') {
      this.errorUbicacion.set(null);
    }
    this.formulario.controls[campo].setValue(texto);
  }

  /** Guarda el lugar elegido de las sugerencias o del GPS. */
  protected elegir(campo: Campo, lugar: Lugar): void {
    if (campo === 'origen') {
      this.errorUbicacion.set(null);
    }
    const control = this.formulario.controls[campo];
    control.setValue(lugar);
    control.markAsTouched();
  }

  /**
   * Usa la ubicación del GPS como origen. Si no se puede, avisa el motivo
   * y pone el cursor en el campo de origen para que se escriba a mano.
   */
  protected async usarUbicacionActual(): Promise<void> {
    this.ubicando.set(true);
    this.errorUbicacion.set(null);
    try {
      const lugar = await this.ubicacion.obtenerUbicacionActual();
      this.elegir('origen', lugar);
    } catch (error) {
      this.errorUbicacion.set(error instanceof ErrorUbicacion ? error.motivo : 'no-disponible');
      this.campoOrigen().nativeElement.focus();
    } finally {
      this.ubicando.set(false);
    }
  }

  protected intercambiar(): void {
    this.errorUbicacion.set(null);
    const { origen, destino } = this.formulario.getRawValue();
    this.formulario.setValue({ origen: destino, destino: origen });
  }

  /**
   * Emite la búsqueda con los nombres para mostrar y las coordenadas para el cálculo
   * del viaje: { origen: { lat, lon }, destino: { lat, lon } }.
   */
  protected buscar(): void {
    this.formulario.markAllAsTouched();
    const { origen, destino } = this.formulario.getRawValue();
    if (this.formulario.invalid || !esLugar(origen) || !esLugar(destino)) {
      return;
    }
    this.search.emit({
      origin: origen.nombre,
      destination: destino.nombre,
      coordenadas: { origen: origen.coordenada, destino: destino.coordenada },
    });
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

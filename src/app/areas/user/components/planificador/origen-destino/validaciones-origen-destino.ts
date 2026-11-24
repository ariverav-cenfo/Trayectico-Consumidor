import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { esMismoPunto, estaDentroDeGam } from '../../../../../services/geo/calculos-geo';
import { Lugar } from '../../../../../interfaces/lugar';

/**
 * Indica si un valor es un lugar con coordenadas (elegido de las sugerencias o del GPS).
 */
export function esLugar(valor: unknown): valor is Lugar {
  if (typeof valor !== 'object' || valor === null) {
    return false;
  }
  const coordenada = (valor as Lugar).coordenada;
  return (
    typeof coordenada === 'object' &&
    coordenada !== null &&
    typeof coordenada.lat === 'number' &&
    typeof coordenada.lon === 'number'
  );
}

/**
 * El campo debe tener un lugar reconocido, no solo texto escrito.
 * El campo vacío no lo revisa: de eso se encarga Validators.required.
 * Error: { lugarNoReconocido: true } → "No encontramos esa dirección. Elegí una sugerencia".
 */
export const lugarReconocidoValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const valor = control.value;
  if (valor === null || valor === undefined || valor === '') {
    return null;
  }
  return esLugar(valor) ? null : { lugarNoReconocido: true };
};

/**
 * El lugar debe estar dentro de la GAM.
 * Si el valor no es un lugar, no lo revisa: de eso se encarga lugarReconocidoValidator.
 * Error: { fueraDeGam: true } → mensaje con la cobertura del servicio.
 */
export const dentroDeGamValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const valor = control.value;
  if (!esLugar(valor)) {
    return null;
  }
  return estaDentroDeGam(valor.coordenada) ? null : { fueraDeGam: true };
};

/**
 * Validador del grupo: origen y destino no pueden ser el mismo punto (menos de 50 m).
 * Error en el grupo: { mismoPunto: true }.
 *
 * @param campoOrigen nombre del control del origen en el FormGroup
 * @param campoDestino nombre del control del destino en el FormGroup
 */
export function origenDestinoDistintosValidator(
  campoOrigen = 'origen',
  campoDestino = 'destino',
): ValidatorFn {
  return (grupo: AbstractControl): ValidationErrors | null => {
    const origen = grupo.get(campoOrigen)?.value;
    const destino = grupo.get(campoDestino)?.value;
    if (!esLugar(origen) || !esLugar(destino)) {
      return null;
    }
    return esMismoPunto(origen.coordenada, destino.coordenada) ? { mismoPunto: true } : null;
  };
}

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { describe, expect, it } from 'vitest';
import { Lugar } from '../../../../../interfaces/lugar';
import {
  dentroDeGamValidator,
  lugarReconocidoValidator,
  origenDestinoDistintosValidator,
} from './validaciones-origen-destino';

const METROS_POR_GRADO = 111_195;

const lugar = (lat: number, lon: number, nombre = 'Lugar de prueba'): Lugar => ({
  nombre,
  detalle: '',
  coordenada: { lat, lon },
});

const SAN_JOSE = lugar(9.9281, -84.0907, 'San José');
const HEREDIA = lugar(9.9981, -84.1165, 'Heredia');
const LIBERIA = lugar(10.6346, -85.4377, 'Liberia');

/** Lugar a cierta cantidad de metros al norte de San José. */
const aMetrosDeSanJose = (metros: number): Lugar =>
  lugar(SAN_JOSE.coordenada.lat + metros / METROS_POR_GRADO, SAN_JOSE.coordenada.lon);

/** Formulario igual al que usará el componente origen-destino. */
function crearFormulario(): FormGroup {
  const validadores = [Validators.required, lugarReconocidoValidator, dentroDeGamValidator];
  return new FormGroup(
    {
      origen: new FormControl<Lugar | string | null>(null, validadores),
      destino: new FormControl<Lugar | string | null>(null, validadores),
    },
    { validators: origenDestinoDistintosValidator() },
  );
}

describe('validaciones de origen y destino', () => {
  it('pide los dos campos', () => {
    const form = crearFormulario();
    expect(form.get('origen')?.hasError('required')).toBe(true);
    expect(form.get('destino')?.hasError('required')).toBe(true);
    expect(form.valid).toBe(false);
  });

  it('rechaza texto escrito sin elegir una sugerencia', () => {
    const form = crearFormulario();
    form.get('origen')?.setValue('Hospital México');
    expect(form.get('origen')?.hasError('lugarNoReconocido')).toBe(true);
  });

  it('rechaza un lugar fuera de la GAM', () => {
    const form = crearFormulario();
    form.get('destino')?.setValue(LIBERIA);
    expect(form.get('destino')?.hasError('fueraDeGam')).toBe(true);
  });

  it('acepta un lugar dentro de la GAM', () => {
    const form = crearFormulario();
    form.get('origen')?.setValue(SAN_JOSE);
    expect(form.get('origen')?.valid).toBe(true);
  });

  it('rechaza origen y destino a menos de 50 m', () => {
    const form = crearFormulario();
    form.setValue({ origen: SAN_JOSE, destino: aMetrosDeSanJose(30) });
    expect(form.hasError('mismoPunto')).toBe(true);
    expect(form.valid).toBe(false);
  });

  it('acepta origen y destino a 50 m o más', () => {
    const form = crearFormulario();
    form.setValue({ origen: SAN_JOSE, destino: aMetrosDeSanJose(60) });
    expect(form.hasError('mismoPunto')).toBe(false);
  });

  it('acepta un viaje válido', () => {
    const form = crearFormulario();
    form.setValue({ origen: SAN_JOSE, destino: HEREDIA });
    expect(form.valid).toBe(true);
  });
});

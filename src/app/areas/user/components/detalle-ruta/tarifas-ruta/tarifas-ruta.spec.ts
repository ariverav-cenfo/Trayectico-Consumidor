import { TestBed } from '@angular/core/testing';
import type { RutaConRamales } from '../../../../../interfaces/ruta';
import type { Ramal } from '../../../../../interfaces/ramal';
import { TarifasRuta } from './tarifas-ruta';

/** Ramal de prueba con la tarifa indicada. */
function ramal(codigo: string, nombre: string, tarifa: Ramal['tarifa']): Ramal {
  return { codigo_ramal: codigo, nombre_ramal: nombre, tarifa, recorridos: [] };
}

/** Crea el componente con la ruta indicada y devuelve su elemento. */
async function mostrar(ramales: Ramal[]): Promise<HTMLElement> {
  const ruta: RutaConRamales = { codigo_ruta: '0002', nombre_ruta: 'SAN JOSÉ - SABANA', ramales };
  const fixture = TestBed.createComponent(TarifasRuta);
  fixture.componentRef.setInput('route', ruta);
  await fixture.whenStable();
  return fixture.nativeElement as HTMLElement;
}

/** Texto de la celda de tarifa de cada fila, sin espacios repetidos. */
function tarifas(element: HTMLElement): string[] {
  return [...element.querySelectorAll('tbody tr')].map((fila) =>
    (fila.querySelector('td:last-child')!.textContent ?? '').replace(/\s+/g, ' ').trim(),
  );
}

describe('TarifasRuta', () => {
  beforeEach(() => TestBed.configureTestingModule({ imports: [TarifasRuta] }));

  it('muestra la tarifa exacta de cada ramal en colones', async () => {
    const element = await mostrar([
      ramal('0002-A', 'SABANA CEMENTERIO', { monto_colones: 240, exacta: true }),
      ramal('0002-B', 'LA PITAHAYA', { monto_colones: 240, exacta: true }),
    ]);

    expect(tarifas(element)).toEqual(['₡240,00', '₡240,00']);
    expect(element.textContent).not.toContain('viaje completo');
  });

  it('muestra "Tarifa no disponible" en el ramal sin tarifa, sin ningún monto', async () => {
    const element = await mostrar([
      ramal('0016-A', 'SIN TARIFA', null),
      ramal('0016-B', 'CON TARIFA', { monto_colones: 250, exacta: true }),
    ]);

    expect(tarifas(element)).toEqual(['Tarifa no disponible', '₡250,00']);
  });

  it('marca la tarifa de viaje completo cuando no es exacta y explica qué significa', async () => {
    const element = await mostrar([ramal('0009-A', 'VARIAS FRACCIONES', { monto_colones: 650, exacta: false })]);

    expect(tarifas(element)).toEqual(['₡650,00 · viaje completo']);
    expect(element.textContent).toContain('puede pagar menos según dónde suba y baje');
  });

  it('indica que la tarifa no está disponible si la ruta no tiene ramales', async () => {
    const element = await mostrar([]);

    expect(element.textContent).toContain('Tarifa no disponible');
    expect(element.textContent).not.toContain('₡');
  });
});

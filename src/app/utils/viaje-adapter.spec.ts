import { Title } from "@angular/platform-browser";
import { MapperBackendOpcionesViaje } from "./viaje-adapter";

const tramoCaminata ={
    tipo: 'caminata',
    distancia_metros: 150,
    geometria: { coordinates: [[-84.0,9.9], [-84.1,9.95]] },
};

const tramoBus = {
    tipo: 'bus',
    codigo_ruta: '0002',
    nombre_ruta: 'San José - Heredia',
    acepta_pago_electronico: true,
    parada_abordaje: { nombre_parada: 'Parada A' },
    parada_descenso: { nombre_parada: 'Parada B' },
    geometria: { coordinates:[[-84.2, 10.0]] },
};

const build = (opciones: unknown[]) =>({ opciones }) as any;

describe('MapperBackendOpcionesViaje', () => {
    it('regresa arreglo vacio cuando no hay opciones', () => {
        expect(MapperBackendOpcionesViaje(build([]))).toEqual([]);
    });
    
    
    it('mapea una opcion de bus sin transbordos', () => {
        const [opt] = MapperBackendOpcionesViaje(
            build([{ transbordos: 0, costo_total: 540, tramos: [tramoCaminata, tramoBus]}])
        );

        expect(opt.id).toBe('opcion-1');
        expect(opt.title).toBe('Sin transbordo');
        expect(opt.price).toBe('₡540');
        expect(opt.payment).toBe('Acepta pago electrónico');
        expect(opt.routeId).toBe('0002');
        expect(opt.points).toBe('-84,9.9 -84.1,9.95 -84.2,10');
        expect(opt.steps).toEqual([
            { title: 'Caminar', description: 'Caminar 150 metros', icon: 'walk'},
            {
                title: 'Bus 0002 - San José - Heredia',
        description: 'Abordar en Parada A y bajar en Parada B',
        icon: 'bus',
            },
        ]);
    
    });

    it('describe transbordos, tarifas faltantes y pago en efectivo', () =>{
        const [opt]= MapperBackendOpcionesViaje(
            build([
                {
                    transbordos: 2,
                    costo_total: 0,
                    tramos: [{ ...tramoBus, acepta_pago_electronico: false }],
                },
            ]),
        );
        expect(opt.title).toBe('2 transbordo(s)');
        expect(opt.price).toBe('Tarifa no disponible');
        expect(opt.payment).toBe('Efectivo');
    });

    it('Vuelve a rutaid en null/vacia cuando no hay tracto en bus', () => {
        const [opt] = MapperBackendOpcionesViaje(
            build([{ transbordos: 0, costo_total: 100, tramos: [tramoCaminata] }]),
        );
        expect(opt.routeId).toBe('');
        expect(opt.payment).toBe('Efectivo');
    });

    it('enumera multiples opciones sequencialmente', () =>{
        const resultado = MapperBackendOpcionesViaje(
            build([
                { transbordos: 0, costo_total: 1, tramos: [tramoBus] },
                { transbordos: 1, costo_total: 2, tramos: [tramoBus] },
            ]),
        );
        expect(resultado.map((o) => o.id)).toEqual(['opcion-1', 'opcion-2']);
    });
});
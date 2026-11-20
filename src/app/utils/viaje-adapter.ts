import { ViajeResponseDTO , TramoResponseDTO} from "../interfaces/api-calculo-viaje";
import { OpcionesViajeResponseDTO } from "../interfaces/api-calculo-viaje";
import { TripOption } from "../interfaces/trip-option";

export function MapperBackendOpcionesViaje(response: ViajeResponseDTO): TripOption[] {
  return response.opciones.map((op, index) => {
    const id = `opcion-${index + 1}`;
    
    
    const points = op.tramos.flatMap((tramo) =>
      tramo.geometria.coordinates.map(([lon, lat]) => `${lon},${lat}`)
    ).join(' ');

    
    const steps = op.tramos.map((tramo) => {
      if (tramo.tipo === 'caminata') {
        return {
          title: 'Caminar',
          description: `Caminar ${tramo.distancia_metros} metros`,
          icon: 'walk',
        };
      }
      return {
        title: `Bus ${tramo.codigo_ruta} - ${tramo.nombre_ruta}`,
        description: `Abordar en ${tramo.parada_abordaje?.nombre_parada} y bajar en ${tramo.parada_descenso?.nombre_parada}`,
        icon: 'bus',
      };
    });

    const busTramo = op.tramos.find((t) => t.tipo === 'bus');

    return {
      id,
      title: op.transbordos === 0 ? 'Sin transbordo' : `${op.transbordos} transbordo(s)`,
      price: op.costo_total ? `₡${op.costo_total}` : 'Tarifa no disponible',
      payment: busTramo?.acepta_pago_electronico ? 'Acepta pago electrónico' : 'Efectivo',
      routeId: busTramo?.codigo_ruta ?? '',
      points,
      steps,
    } as unknown as TripOption;
  });
}
import type { SolicitudViaje } from './solicitud-viaje';

/** Búsqueda del planificador: los nombres que se muestran y las coordenadas para el cálculo. */
export interface BusquedaReciente {
  origin: string;
  destination: string;
  /**
   * Coordenadas de origen y destino. Las búsquedas guardadas antes de SCRUM-81 no las tienen:
   * esas se restauran como texto y hay que volver a elegir los lugares.
   */
  coordenadas?: SolicitudViaje;
}

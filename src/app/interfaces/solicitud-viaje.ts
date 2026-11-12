import type { Coordenada } from './lugar';

/**
 * Petición del cálculo del viaje acordada para SCRUM-81 y SCRUM-88:
 * origen y destino en WGS84, con el formato de SCRUM-89.
 */
export interface SolicitudViaje {
  origen: Coordenada;
  destino: Coordenada;
}

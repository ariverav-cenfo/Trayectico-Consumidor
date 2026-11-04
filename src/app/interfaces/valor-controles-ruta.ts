export type SentidoRecorrido = 'Ida' | 'Regreso';
export interface ValorControlesRuta {
  branch: string;
  direction: SentidoRecorrido;
}

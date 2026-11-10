export type TipoAviso = 'Cierre de vía' | 'Avería' | 'Bloqueo';

export interface Aviso {
  id: string;
  routeId: string;
  type: TipoAviso;
  title: string;
  description: string;
  resolved: boolean;
}

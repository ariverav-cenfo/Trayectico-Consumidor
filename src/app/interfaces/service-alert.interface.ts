export type ServiceAlertType = 'Cierre de vía' | 'Avería' | 'Bloqueo';

export interface ServiceAlertData {
  id: string;
  routeId: string;
  type: ServiceAlertType;
  title: string;
  description: string;
  resolved: boolean;
}

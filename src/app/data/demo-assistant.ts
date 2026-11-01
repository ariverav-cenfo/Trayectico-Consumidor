import type { AssistantMessage } from '../interfaces/assistant-message.interface';
export const DEMO_MESSAGES: AssistantMessage[] = [
  { id: 1, role: 'user', text: '¿Cómo llego de [Origen] a [Destino]?' },
  {
    id: 2,
    role: 'assistant',
    text: 'Encontré una opción con la ruta 0002.',
    action: 'Busqué la ruta de [Origen] a [Destino].',
    link: '/planificar/resultado',
  },
];

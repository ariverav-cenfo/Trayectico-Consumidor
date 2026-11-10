export type RolMensaje = 'user' | 'assistant';

export interface MensajeAsistente {
  id: number;
  role: RolMensaje;
  text: string;
  action?: string;
  link?: string;
}

export type RespuestaAsistente = Pick<MensajeAsistente, 'text' | 'action' | 'link'>;

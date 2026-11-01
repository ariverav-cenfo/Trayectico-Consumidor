export type AssistantRole = 'user' | 'assistant';

export interface AssistantMessage {
  id: number;
  role: AssistantRole;
  text: string;
  action?: string;
  link?: string;
}

export type AssistantReply = Pick<AssistantMessage, 'text' | 'action' | 'link'>;

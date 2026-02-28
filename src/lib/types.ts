import { UIMessage } from 'ai';

export interface MessagePart {
  type: 'reasoning' | 'text';
  text: string;
}

export interface Message extends Omit<UIMessage, 'parts'> {
  parts?: MessagePart[];
}

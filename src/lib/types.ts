import { UIMessage } from 'ai';

/**
 * Defines the structure of individual parts of a message.
 * Supports 'reasoning' (for future use) and 'text' content.
 */
export interface MessagePart {
  type: 'reasoning' | 'text';
  text: string;
}

/**
 * Extends the AI SDK's UIMessage to support our custom structured MessageParts,
 * which allow for more granular control over how the AI response is rendered.
 */
export interface Message extends Omit<UIMessage, 'parts'> {
  parts?: MessagePart[];
}

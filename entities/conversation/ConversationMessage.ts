export interface ConversationMessage {
  type: 'user' | 'system';
  text: string;
  timestamp?: string;
}

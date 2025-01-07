import { ConversationsHistoryResponse } from '@slack/web-api';
import { ConversationMessage } from '@/entities/conversation';

export function mapSlackMessages(
  messages: ConversationsHistoryResponse['messages'],
): Array<ConversationMessage> {
  if (!messages) {
    return [];
  }

  return messages.toReversed().map((message) => ({
    text: message.text || '',
    type: message.bot_id ? 'system' : 'user',
    timestamp: message.ts,
  }));
}

import { slackClient } from '@/shared/slackClient';
import { SLACK_CHANNEL } from '@/shared/consts';

import { mapSlackMessages } from '../utils/slackMappers';

interface FetchSlackConversationOptions {
  limit?: number;
}

export async function fetchSlackConversation(
  options: FetchSlackConversationOptions = {},
) {
  const { limit = 10 } = options;

  const response = await slackClient.conversations.history({
    channel: SLACK_CHANNEL,
    limit,
  });
  return { messages: mapSlackMessages(response.messages) };
}

import {
  getNotionProjectList,
  getNotionTaskList,
} from '@/features/notionTasks';
import {
  fetchSlackConversation,
  sendSlackMessage,
} from '@/features/slackConversation';
import { getOpenaiChatCompletion } from '@/features/openaiChat';
import { BotMessageEvent } from '@slack/web-api';
import { SLACK_CHANNEL } from '@/shared/consts';

interface SlackMessage {
  type: string;
  challenge?: string;
  event: BotMessageEvent;
}

async function handleSlackUserMessage() {
  const [tasks, projects, slackConversation] = await Promise.all([
    getNotionTaskList(),
    getNotionProjectList(),
    fetchSlackConversation(),
  ]);

  const answer = await getOpenaiChatCompletion({
    tasks,
    projects,
    messages: slackConversation.messages,
  });

  await sendSlackMessage(answer);
}

export async function handleSlackMessage(
  slackMessage: SlackMessage,
): Promise<object | undefined> {
  const { type, challenge, event } = slackMessage;

  if (type === 'url_verification') {
    return { challenge };
  }

  if (type === 'event_callback') {
    const { type: eventType, channel, bot_id } = event;

    if (eventType === 'message' && channel === SLACK_CHANNEL && !bot_id) {
      // Not awaiting the response intentionally to prevent Slack from retrying the message
      void handleSlackUserMessage();
      return;
    }
  }
}

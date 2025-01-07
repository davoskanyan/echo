import { slackClient } from '@/shared/slackClient';
import { SLACK_CHANNEL } from '@/shared/consts';

export async function sendSlackMessage(text: string) {
  await slackClient.chat.postMessage({
    channel: SLACK_CHANNEL,
    text,
  });
}

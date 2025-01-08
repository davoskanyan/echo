import { getNotionTaskList } from '@/features/notionTasks';
import {
  fetchSlackConversation,
  sendSlackMessage,
} from '@/features/slackConversation';
import { getOpenaiChatCompletion } from '@/features/openaiChat';

const channelId = process.env.SLACK_CHANNEL as string;

let lastEventTime: number | undefined;

export async function POST(request: Request) {
  try {
    const { type, challenge, event } = await request.json();

    if (type === 'url_verification') {
      return Response.json({ challenge });
    }

    const eventTime = Number(event.ts);
    console.log({ lastEventTime, eventTime });
    if (lastEventTime && lastEventTime >= eventTime) {
      return Response.json({});
    }
    lastEventTime = eventTime;

    if (type === 'event_callback') {
      const { type: eventType, channel, bot_id } = event;

      if (eventType === 'message' && channel === channelId && !bot_id) {
        const [tasks, slackConversation] = await Promise.all([
          getNotionTaskList(),
          fetchSlackConversation(),
        ]);

        const answer = await getOpenaiChatCompletion({
          tasks,
          messages: slackConversation.messages,
        });

        await sendSlackMessage(answer);
      }
    }

    return Response.json({});
  } catch (error: unknown) {
    console.error(
      'Error processing Slack event:',
      JSON.stringify(error, null, 2),
    );
    return Response.json(error, { status: 500 });
  }
}

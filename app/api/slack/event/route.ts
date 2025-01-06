import { baseUrl } from '@/utils/baseUrl';

const channelId = process.env.SLACK_CHANNEL as string;

let lastEventTime: number | undefined;

export async function POST(request: Request) {
  try {
    const { type, challenge, event } = await request.json();
    console.log('dv:', 'slack event 1');

    if (type === 'url_verification') {
      return Response.json({ challenge });
    }

    const eventTime = Number(event.ts);
    if (lastEventTime && lastEventTime >= eventTime) {
      return Response.json({});
    }
    lastEventTime = eventTime;
    console.log('dv:', 'slack event 2');

    if (type === 'event_callback') {
      const { type: eventType, text, channel, bot_id } = event;

      if (eventType === 'message' && channel === channelId && !bot_id) {
        console.log('dv:', 'slack event 3');
        const response = await fetch(`${baseUrl}/api/openapi`, {
          method: 'POST',
          body: JSON.stringify({ text }),
        });
        console.log('dv:', 'slack event 4');
        const answer = await response.json();
        await fetch(`${baseUrl}/api/slack/message`, {
          method: 'POST',
          body: JSON.stringify({ text: answer.completion }),
        });
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

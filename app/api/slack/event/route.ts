const channelId = process.env.SLACK_CHANNEL as string;
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL as string;

console.log('dv:', { baseUrl });

let lastEventTime: number | undefined;

export async function POST(request: Request) {
  const { type, challenge, event } = await request.json();
  const eventTime = Number(event.ts);
  if (lastEventTime && lastEventTime >= eventTime) {
    return Response.json({});
  }
  lastEventTime = eventTime;

  if (type === 'url_verification') {
    return Response.json({ challenge });
  }

  if (type === 'event_callback') {
    const { type: eventType, text, channel, bot_id } = event;

    if (eventType === 'message' && channel === channelId && !bot_id) {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/openapi`,
        {
          method: 'POST',
          body: JSON.stringify({ text }),
        },
      );
      const answer = await response.json();
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/slack/message`, {
        method: 'POST',
        body: JSON.stringify({ text: answer.completion }),
      });
    }
  }

  return Response.json({});
}

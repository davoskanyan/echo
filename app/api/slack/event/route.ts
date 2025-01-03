const channelId = process.env.SLACK_CHANNEL as string;

export async function POST(request: Request) {
  const { type, challenge, event } = await request.json();

  if (type === 'url_verification') {
    return Response.json({ challenge });
  }

  if (type === 'event_callback') {
    const { type: eventType, text, channel, bot_id } = event;

    if (eventType === 'message' && channel === channelId && !bot_id) {
      console.log(`Message received ${text}`);
    }
  }

  return Response.json({});
}

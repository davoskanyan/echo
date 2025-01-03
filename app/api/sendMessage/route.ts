import { WebClient } from '@slack/web-api';

const token = process.env.SLACK_BOT_TOKEN;
const web = new WebClient(token);

async function sendSlackMessage(text: string, channel: string = 'echoo') {
  try {
    return await web.chat.postMessage({
      channel,
      text,
    });
  } catch (error) {
    console.error('Error sending Slack message:', error);
    throw error;
  }
}

export async function POST(request: Request) {
  const { text } = await request.json();

  try {
    const result = await sendSlackMessage(text);
    return Response.json(result);
  } catch (error: unknown) {
    return Response.json(error, { status: 500 });
  }
}

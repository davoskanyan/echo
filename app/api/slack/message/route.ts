import { sendSlackMessage } from '@/features/slackConversation';

export async function POST(request: Request) {
  const { text } = await request.json();

  try {
    await sendSlackMessage(text);
    return Response.json({ message: 'Message sent' });
  } catch (error) {
    console.error('Error sending Slack message:', error);
    return Response.json(error, { status: 500 });
  }
}

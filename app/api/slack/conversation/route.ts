import { fetchSlackConversation } from '@/features/slackConversation';

export async function GET() {
  try {
    const { messages } = await fetchSlackConversation();
    return Response.json({ messages });
  } catch (error) {
    console.error('Error fetching Slack conversation:', error);
    return Response.json(error, { status: 500 });
  }
}

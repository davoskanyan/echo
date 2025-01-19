import { handleSlackMessage } from '@/features/slackConversation';

export async function POST(request: Request) {
  try {
    const message = await request.json();
    const headers = request.headers;

    // Slack retries when it doesn't receive a response in time
    const retry = headers.get('x-slack-retry-num');
    if (retry) {
      return Response.json({});
    }

    const data = await handleSlackMessage(message);
    return Response.json(data || {});
  } catch (error: unknown) {
    console.error(
      'Error processing Slack event:',
      JSON.stringify(error, null, 2),
    );
    return Response.json(error, { status: 500 });
  }
}

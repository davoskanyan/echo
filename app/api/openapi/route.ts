import { fetchSlackConversation } from '@/features/slackConversation';
import { fetchNotionTasks } from '@/features/notionTasks';
import { getOpenaiChatCompletion } from '@/features/openaiChat';

export async function POST() {
  try {
    const [tasks, slackConversation] = await Promise.all([
      fetchNotionTasks(),
      fetchSlackConversation(),
    ]);

    const output = await getOpenaiChatCompletion({
      tasks,
      messages: slackConversation.messages,
    });
    return Response.json(output);
  } catch (error) {
    console.error('Error getting openai chat completion:', error);
    return Response.json(error, { status: 500 });
  }
}

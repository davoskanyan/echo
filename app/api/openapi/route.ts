import { fetchSlackConversation } from '@/features/slackConversation';
import { getNotionTaskList } from '@/features/notionTasks';
import { getOpenaiChatCompletion } from '@/features/openaiChat';

export async function POST() {
  try {
    const [notionTasks, slackConversation] = await Promise.all([
      getNotionTaskList(),
      fetchSlackConversation(),
    ]);

    const output = await getOpenaiChatCompletion({
      tasks: notionTasks,
      messages: slackConversation.messages,
    });
    return Response.json(output);
  } catch (error) {
    console.error('Error getting Openai chat completion:', error);
    return Response.json(error, { status: 500 });
  }
}

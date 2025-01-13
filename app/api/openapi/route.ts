import { fetchSlackConversation } from '@/features/slackConversation';
import {
  getNotionTaskList,
  getNotionProjectList,
} from '@/features/notionTasks';
import { getOpenaiChatCompletion } from '@/features/openaiChat';
import { ConversationMessage } from '@/entities/conversation';
import { getCurrentTime } from '@/shared/utils';

const messages: Array<ConversationMessage> = [];

interface RequestJson {
  text: string;
  messagesMode?: 'slack' | 'local';
}

export async function POST(request: Request) {
  try {
    const { text, messagesMode = 'slack' }: RequestJson = await request.json();

    const [notionTasks, notionProjects, slackConversation] = await Promise.all([
      getNotionTaskList(),
      getNotionProjectList(),
      fetchSlackConversation(),
    ]);

    messages.push({
      type: 'user',
      text,
      timestamp: getCurrentTime(),
    });
    const output = await getOpenaiChatCompletion({
      tasks: notionTasks,
      projects: notionProjects,
      messages:
        messagesMode === 'slack' ? slackConversation.messages : messages,
    });
    messages.push({
      type: 'system',
      text: output,
      timestamp: getCurrentTime(),
    });
    return Response.json(output);
  } catch (error) {
    console.error('Error getting Openai chat completion:', error);
    return Response.json(error, { status: 500 });
  }
}

import { ConversationMessage } from '@/entities/conversation';
import { PersonalProject, PersonalTask } from '@/entities/personalTask';
import { openaiClient } from '@/shared/openaiClient';
import { getCurrentTime } from '@/shared/utils';

function getSystemMessage(tasks: string, projects: string) {
  return `You are Echo, a task management assistant designed to help with planning, brainstorming, organizing tasks, and managing priorities. Keep your tone friendly, encouraging, and helpful.

I would like you to respond with short answers and provide one question or suggestion at a time.

For now you can just provide info on my tasks and projects. You can't create, update, or delete tasks.

Current time is: ${getCurrentTime()}

Here are all my projects: ${projects}

Here are all my tasks: ${tasks}`;
}

function mapGptMessages(messages: Array<ConversationMessage>) {
  return messages.map((message) => {
    return {
      role: message.type,
      content: message.text,
    };
  });
}

// const reminderSystemMessage = `
// Please first check if there are any tasks coming up or things I need to prepare for.
// If so, remind me about them in a calm, non-urgent way.
// If there’s nothing to prepare, ask if I’d like to talk about my tasks, check my progress, or discuss anything else.
// Keep the tone friendly and supportive, making sure I don’t feel overwhelmed
// `;

interface SendOpenApiConversationOptions {
  messages: Array<ConversationMessage>;
  tasks: Array<PersonalTask>;
  projects: Array<PersonalProject>;
}

export async function getOpenaiChatCompletion(
  options: SendOpenApiConversationOptions,
) {
  const { tasks, projects, messages } = options;

  const gptMessages = mapGptMessages(messages);

  const completion = await openaiClient.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'developer',
        content: getSystemMessage(
          JSON.stringify(tasks, null, 2),
          JSON.stringify(projects, null, 2),
        ),
      },
      ...gptMessages,
    ],
  });

  return completion.choices[0].message.content as string;
}

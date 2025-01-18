import { readFile } from 'node:fs/promises';
import Mustache from 'mustache';
import { updateNotionTask } from '@/features/notionTasks';
import { ConversationMessage } from '@/entities/conversation';
import {
  PersonalProject,
  PersonalTask,
  TaskPriority,
  TaskStatus,
} from '@/entities/personalTask';
import { openaiClient } from '@/shared/openaiClient';
import { getCurrentTime } from '@/shared/utils';

async function getActionMessage(
  tasks: Array<PersonalTask>,
  projects: Array<PersonalProject>,
) {
  const templateUrl = new URL('./template-action.mustache', import.meta.url);
  const template = await readFile(templateUrl, 'utf8');
  const data = {
    tasks: JSON.stringify(tasks),
    projects: JSON.stringify(projects),
    taskStatuses: Object.values(TaskStatus),
    taskPriorities: Object.values(TaskPriority),
  };
  return Mustache.render(template, data);
}

async function getUserAnswerMessage(
  tasks: Array<PersonalTask>,
  projects: Array<PersonalProject>,
  actionMessage?: string,
) {
  const currentTime = getCurrentTime();
  const templateUrl = new URL(
    './template-user-answer.mustache',
    import.meta.url,
  );
  const template = await readFile(templateUrl, 'utf8');
  const data = {
    tasks: JSON.stringify(tasks),
    projects: JSON.stringify(projects),
    currentTime,
    actionMessage,
  };
  return Mustache.render(template, data);
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

  const actionCompletion = await openaiClient.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      ...gptMessages,
      {
        role: 'developer',
        content: await getActionMessage(tasks, projects),
      },
    ],
  });

  const actionOutputStr = actionCompletion.choices[0].message.content as string;
  let actionMessage;
  try {
    const actionOutput = JSON.parse(actionOutputStr);
    if (actionOutput.action === 'update task') {
      const response = await updateNotionTask(actionOutput.task);
      actionMessage = `Task updated: ${JSON.stringify(response, null, 2)}`;
    }
  } catch (error) {
    console.error(
      'Error performing action:',
      error,
      'action output:',
      actionOutputStr,
    );
  }

  const userCompletion = await openaiClient.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'developer',
        content: await getUserAnswerMessage(tasks, projects, actionMessage),
      },
      ...gptMessages,
    ],
  });

  return userCompletion.choices[0].message.content as string;
}

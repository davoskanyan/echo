import { createNotionTask, updateNotionTask } from '@/features/notionTasks';
import { ConversationMessage } from '@/entities/conversation';
import {
  PersonalProject,
  PersonalTask,
  TaskPriority,
  TaskStatus,
} from '@/entities/personalTask';
import { openaiClient } from '@/shared/openaiClient';
import { getCurrentTime } from '@/shared/utils';
import { templateAction } from './templateAction';
import { templateUserAnswer } from './templateUserAnswer';

function getActionMessage(
  tasks: Array<PersonalTask>,
  projects: Array<PersonalProject>,
) {
  const data = {
    tasks: JSON.stringify(tasks),
    projects: JSON.stringify(projects),
    taskStatuses: Object.values(TaskStatus).join(','),
    taskPriorities: Object.values(TaskPriority).join(','),
  };

  return Object.entries(data).reduce(
    (template, [key, value]) => template.replaceAll(`{{${key}}}`, value),
    templateAction,
  );
}

function getUserAnswerMessage(
  tasks: Array<PersonalTask>,
  projects: Array<PersonalProject>,
  lastAction?: string,
) {
  const currentTime = getCurrentTime();
  const data = {
    tasks: JSON.stringify(tasks),
    projects: JSON.stringify(projects),
    currentTime,
    lastAction,
  };

  return Object.entries(data).reduce(
    (template, [key, value]) => template.replaceAll(`{{${key}}}`, value || ''),
    templateUserAnswer,
  );
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
        content: getActionMessage(tasks, projects),
      },
    ],
  });

  const actionOutputStr = actionCompletion.choices[0].message.content as string;
  let actionMessage;
  try {
    const actionOutput = JSON.parse(actionOutputStr);
    if (actionOutput.action === 'updateTask') {
      try {
        const response = await updateNotionTask(actionOutput.task);
        actionMessage = `Task updated: ${JSON.stringify(response, null, 2)}`;
      } catch (error) {
        actionMessage = 'Error performing action to update the task';
        console.error('Error creating task:', error);
      }
    }
    if (actionOutput.action === 'createTask') {
      try {
        const response = await createNotionTask(actionOutput.task);
        actionMessage = `Task created: ${JSON.stringify(response, null, 2)}`;
      } catch (error) {
        actionMessage = 'Error performing action to create the task';
        console.error('Error creating task:', error);
      }
    }
  } catch {
    actionMessage = 'Error an performing action';
    console.error('Error parsing action output:', actionOutputStr);
  }

  const userCompletion = await openaiClient.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'developer',
        content: getUserAnswerMessage(tasks, projects, actionMessage),
      },
      ...gptMessages,
    ],
  });

  return userCompletion.choices[0].message.content as string;
}

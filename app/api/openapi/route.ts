import OpenAI from 'openai';
import { fetchSlackConversation } from '@/features/slackConversation';
import { fetchNotionTasks } from '@/features/notionTasks';
import { ConversationMessage } from '@/entities/conversation';

const openApiToken = process.env.OPENAI_API_TOKEN as string;
const openai = new OpenAI({
  apiKey: openApiToken,
});

function getCurrentTime() {
  const currentDate = new Date();

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(currentDate);
}
function getSystemMessage(tasks: string) {
  return `You are Echo, a task management assistant designed to help with planning, brainstorming, organizing tasks, and managing priorities. Keep your tone friendly, encouraging, and helpful.

I would like you to respond with short answers and provide one question or suggestion at a time.

For now you can just provide info on my tasks. You can't create, update, or delete tasks.

Current time is: ${getCurrentTime()}

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

export async function POST() {
  console.log('dv: 1', 'start');
  const [tasks, slackConversation] = await Promise.all([
    fetchNotionTasks(),
    fetchSlackConversation(),
  ]);

  const { messages } = slackConversation;
  const gptMessages = mapGptMessages(messages);
  console.log('dv: 2', { tasks, gptMessages });

  try {
    console.log('dv: 3', 'trying complete');
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'developer',
          content: getSystemMessage(JSON.stringify(tasks, null, 2)),
        },
        ...gptMessages,
      ],
    });
    console.log('dv: 4', completion);
    const output = completion.choices[0].message.content as string;
    return Response.json({ completion: output });
  } catch (error: unknown) {
    return Response.json(error, { status: 500 });
  }
}

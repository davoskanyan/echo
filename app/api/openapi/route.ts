import OpenAI from 'openai';

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

Current time is: ${getCurrentTime()}

Here are all my tasks: ${tasks}`;
}

const reminderSystemMessage = `
Please first check if there are any tasks coming up or things I need to prepare for.
If so, remind me about them in a calm, non-urgent way. 
If there’s nothing to prepare, ask if I’d like to talk about my tasks, check my progress, or discuss anything else. 
Keep the tone friendly and supportive, making sure I don’t feel overwhelmed
`;

export async function POST(request: Request) {
  const { text } = await request.json();
  const tasksResponse = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/notion/tasks`,
  );
  const tasks = await tasksResponse.json();
  const tasksStr = JSON.stringify(tasks, null, 2);

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'developer',
          content: getSystemMessage(tasksStr),
        },
        // {
        //   role: 'developer',
        //   content: reminderSydstemMessage,
        // },
        {
          role: 'user',
          content: text,
        },
      ],
    });
    const output = completion.choices[0].message.content;
    console.log('dv:', output);
    return Response.json({ completion: output });
  } catch (error: unknown) {
    return Response.json(error, { status: 500 });
  }
}

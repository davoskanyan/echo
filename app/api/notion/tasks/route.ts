import { createNotionTask, getNotionTaskList } from '@/features/notionTasks';
import { parseNotionError } from '@/shared/notion';

export async function GET() {
  try {
    const tasks = await getNotionTaskList();
    return Response.json(tasks);
  } catch (error) {
    const notionError = parseNotionError(error);
    if (notionError) {
      return Response.json(notionError.message, { status: notionError.status });
    }
    return Response.json(error, { status: 500 });
  }
}

export async function POST(request: Request) {
  const task = await request.json();
  try {
    const newTask = await createNotionTask(task);
    return Response.json(newTask);
  } catch (error) {
    const notionError = parseNotionError(error);
    if (notionError) {
      return Response.json(notionError.message, { status: notionError.status });
    }
    return Response.json(error, { status: 500 });
  }
}

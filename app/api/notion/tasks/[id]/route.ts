import { getNotionTask, updateNotionTask } from '@/features/notionTasks';
import { parseNotionError } from '@/shared/notion';

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const task = await getNotionTask({ id });
    return Response.json(task);
  } catch (error) {
    const notionError = parseNotionError(error);
    if (notionError) {
      return Response.json(notionError.message, { status: notionError.status });
    }
    return Response.json(error, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const taskUpdates = await request.json();

    const updatedTask = await updateNotionTask({ id, taskUpdates });
    return Response.json(updatedTask);
  } catch (error) {
    const notionError = parseNotionError(error);
    if (notionError) {
      return Response.json(notionError.message, { status: notionError.status });
    }
    return Response.json(error, { status: 500 });
  }
}

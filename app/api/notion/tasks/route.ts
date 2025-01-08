import { getNotionTaskList } from '@/features/notionTasks';

export async function GET() {
  try {
    const tasks = await getNotionTaskList();
    return Response.json(tasks);
  } catch (error) {
    console.error('Error fetching Notion tasks:', error);
    return Response.json(error, { status: 500 });
  }
}

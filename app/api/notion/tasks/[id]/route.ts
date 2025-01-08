import { z } from 'zod';
import { getNotionTask } from '@/features/notionTasks';

const notionErrorSchema = z.object({
  status: z.number(),
  message: z.string(),
});

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const task = await getNotionTask({ id });
    return Response.json(task);
  } catch (e) {
    const { data: notionError } = notionErrorSchema.safeParse(e);
    if (notionError) {
      return Response.json(notionError.message, { status: notionError.status });
    }
    return Response.json('Internal Server Error', { status: 500 });
  }
}

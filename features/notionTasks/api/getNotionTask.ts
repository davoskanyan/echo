import { notionClient } from '@/shared/notionClient';
import { mapNotionTask } from '../utils/notionMapper';
import { NotionTaskRowResponse } from '../models/NotionTaskRowResponse';

interface GetNotionTaskOptions {
  id: string;
}

export async function getNotionTask({ id }: GetNotionTaskOptions) {
  const task = await notionClient.pages.retrieve({
    page_id: id,
  });

  return task && mapNotionTask(task as unknown as NotionTaskRowResponse);
}

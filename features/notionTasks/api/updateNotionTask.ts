import { PersonalTask } from '@/entities/personalTask';
import { notionClient } from '@/shared/notionClient';
import {
  mapNotionTask,
  mapTaskToNotionProperties,
} from '../utils/notionMapper';
import { NotionTaskRowResponse } from '../models/NotionTaskRowResponse';

interface UpdateNotionTaskOptions {
  id: string;
  taskUpdates: Partial<PersonalTask>;
}

export async function updateNotionTask({
  id,
  taskUpdates,
}: UpdateNotionTaskOptions) {
  const properties = mapTaskToNotionProperties(taskUpdates);

  const response = await notionClient.pages.update({
    page_id: id,
    properties,
  });

  return mapNotionTask(response as unknown as NotionTaskRowResponse);
}

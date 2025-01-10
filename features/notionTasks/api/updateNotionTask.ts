import { PersonalTask } from '@/entities/personalTask';
import { notionClient } from '@/shared/notionClient';
import {
  mapNotionTask,
  mapTaskToNotionProperties,
} from '../utils/notionMapper';
import { NotionTaskResponse } from '../models/NotionTaskResponse';
import { updateTaskSchema } from '../schemas/updateTaskSchema';

interface UpdateNotionTaskOptions {
  id: string;
  taskUpdates: Partial<PersonalTask>;
}

export async function updateNotionTask({
  id,
  taskUpdates,
}: UpdateNotionTaskOptions) {
  const properties = mapTaskToNotionProperties(
    updateTaskSchema.parse(taskUpdates),
  );

  const response = await notionClient.pages.update({
    page_id: id,
    properties,
  });

  return mapNotionTask(response as unknown as NotionTaskResponse);
}

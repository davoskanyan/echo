import { PersonalTask } from '@/entities/personalTask';
import { notionClient } from '@/shared/notionClient';
import {
  mapNotionTask,
  mapTaskToNotionProperties,
} from '../utils/notionMapper';
import { NotionTaskResponse } from '../models/NotionTaskResponse';
import { updateTaskSchema } from '../schemas/updateTaskSchema';

type UpdateNotionTaskOptions = Partial<PersonalTask> & {
  id: string;
};

export async function updateNotionTask(taskUpdates: UpdateNotionTaskOptions) {
  const properties = mapTaskToNotionProperties(
    updateTaskSchema.parse(taskUpdates),
  );

  const response = await notionClient.pages.update({
    page_id: taskUpdates.id,
    properties,
  });

  return mapNotionTask(response as unknown as NotionTaskResponse);
}

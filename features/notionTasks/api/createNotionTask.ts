import { PersonalTask } from '@/entities/personalTask';
import { notionClient } from '@/shared/notionClient';
import { NOTION_TASKS_DATABASE_ID } from '@/shared/consts';

import {
  mapNotionTask,
  mapTaskToNotionProperties,
} from '../utils/notionMapper';
import { getNotionProjectList } from './getNotionProjectList';
import { createTaskSchema } from '../schemas/createTaskSchema';
import { NotionTaskResponse } from '../models/NotionTaskResponse';

type NewTask = Partial<PersonalTask> & {
  name: string;
};

export async function createNotionTask(task: NewTask) {
  const taskParsed = createTaskSchema.parse(task);

  if (!taskParsed.projectId && taskParsed.project) {
    const projects = await getNotionProjectList(); // TODO: filter by name
    const project = projects.find(
      (project) =>
        project.name.toLowerCase() === taskParsed.project!.toLowerCase(),
    );

    if (!project) {
      throw new Error(
        `Project with the given name "${taskParsed.project}" not found`,
      );
    }
    taskParsed.projectId = project.id;
  }

  const notionTask = mapTaskToNotionProperties(taskParsed);

  const result = await notionClient.pages.create({
    parent: {
      database_id: NOTION_TASKS_DATABASE_ID,
    },
    properties: notionTask,
  });

  return mapNotionTask(result as unknown as NotionTaskResponse);
}

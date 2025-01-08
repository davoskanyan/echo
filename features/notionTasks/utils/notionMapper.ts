import { PersonalTask } from '@/entities/personalTask';
import { NotionTaskRowResponse } from '../models/NotionTaskRowResponse';

export function mapNotionTask(
  task: NotionTaskRowResponse,
): PersonalTask | null {
  return {
    name: task.properties['Task name'].title[0].text.content,
    status: task.properties.Status.status.name,
    priority: task.properties['Priority API'].formula.string,
    project: task.properties['Project API'].formula.string,
    duration: task.properties.Duration.formula.string,
    dueStart: task.properties.Due.date?.start,
    dueEnd: task.properties.Due.date?.end,
  };
}

export function mapNotionTaskList(
  db: Array<NotionTaskRowResponse>,
): Array<PersonalTask> {
  return db
    .map((taskResponse) => {
      try {
        return mapNotionTask(taskResponse);
      } catch {
        return null;
      }
    })
    .filter(Boolean) as Array<PersonalTask>;
}

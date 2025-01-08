import { PersonalTask } from '@/entities/personalTask';
import { taskUpdateSchema } from '../schemas/taskUpdateSchema';
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

export function mapTaskToNotionProperties(taskUpdates: Partial<PersonalTask>) {
  const { name, status, duration, dueStart, dueEnd, priority } =
    taskUpdateSchema.parse(taskUpdates);

  return {
    'Task name': name ? { title: [{ text: { content: name } }] } : undefined,
    Status: status ? { status: { name: status } } : undefined,
    Mins: duration ? { number: Number(duration) } : undefined,
    Due:
      dueStart && dueEnd
        ? { date: { start: dueStart, end: dueEnd, time_zone: 'Asia/Yerevan' } }
        : undefined,
    Priority: priority ? { select: { name: priority } } : undefined,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
}

import { PersonalProject, PersonalTask } from '@/entities/personalTask';
import { NotionTaskResponse } from '../models/NotionTaskResponse';
import { NotionProjectResponse } from '../models/NotionProjectResponse';

export function mapNotionTask(task: NotionTaskResponse): PersonalTask | null {
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
  db: Array<NotionTaskResponse>,
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
  const { name, status, duration, dueStart, dueEnd, priority, projectId } =
    taskUpdates;

  return {
    'Task name': name ? { title: [{ text: { content: name } }] } : undefined,
    Status: status ? { status: { name: status } } : undefined,
    Mins: duration ? { number: Number(duration) } : undefined,
    Due:
      dueStart && dueEnd
        ? { date: { start: dueStart, end: dueEnd, time_zone: 'Asia/Yerevan' } }
        : undefined,
    Priority: priority ? { select: { name: priority } } : undefined,
    Project: projectId ? { relation: [{ id: projectId }] } : undefined,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
}

export function mapNotionProject(
  project: NotionProjectResponse,
): PersonalProject {
  return {
    id: project.id,
    name: project.properties['Project name'].title[0].text.content,
  };
}

export function mapNotionProjectList(db: Array<NotionProjectResponse>) {
  return db
    .map((projectResponse) => {
      try {
        return mapNotionProject(projectResponse);
      } catch {
        return null;
      }
    })
    .filter(Boolean) as Array<PersonalProject>;
}

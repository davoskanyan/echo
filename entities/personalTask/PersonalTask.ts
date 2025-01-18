import { TaskStatusType } from './TaskStatus';
import { TaskPriorityType } from './TaskPriority';

export interface PersonalTask {
  id: string;
  name: string;
  status: TaskStatusType;
  priority: TaskPriorityType;
  project: string;
  duration: string;
  dueStart?: string;
  dueEnd?: string;
  projectId?: string;
}

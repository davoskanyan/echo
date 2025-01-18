export const TaskStatus = {
  NOT_STARTED: 'Not Started',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
  ARCHIVED: 'Archived',
} as const;

export type TaskStatusType = (typeof TaskStatus)[keyof typeof TaskStatus];

export const TaskPriority = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
} as const;

export type TaskPriorityType = (typeof TaskPriority)[keyof typeof TaskPriority];

import { z } from 'zod';
import {
  TaskPriority,
  TaskPriorityType,
  TaskStatus,
  TaskStatusType,
} from '@/entities/personalTask';
import { zodValidators } from '@/shared/utils';

export const createTaskSchema = z
  .object({
    name: z.string(),
    status: z
      .custom<TaskStatusType>(...zodValidators.inObjectValues(TaskStatus))
      .optional(),
    priority: z
      .custom<TaskPriorityType>(...zodValidators.inObjectValues(TaskPriority))
      .optional(),
    duration: z.string().optional(),
    dueStart: z.string().optional(),
    dueEnd: z.string().optional(),
    project: z.string().optional(),
    projectId: z.string().optional(),
  })
  .refine(
    (data) =>
      (data.dueStart && data.dueEnd) || (!data.dueStart && !data.dueEnd),
    {
      message:
        'dueStart and dueEnd must either both be provided or both be absent',
    },
  );

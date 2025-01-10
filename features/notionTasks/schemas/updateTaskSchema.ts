import { z } from 'zod';

export const updateTaskSchema = z
  .object({
    name: z.string().optional(),
    status: z
      .enum(['Not Started', 'In Progress', 'Done', 'Archived'])
      .optional(),
    priority: z.enum(['Low', 'Medium', 'High']).optional(),
    duration: z.string().optional(),
    dueStart: z.string().optional(),
    dueEnd: z.string().optional(),
  })
  .refine(
    (data) =>
      (data.dueStart && data.dueEnd) || (!data.dueStart && !data.dueEnd),
    {
      message:
        'dueStart and dueEnd must either both be provided or both be absent',
    },
  );

import { z } from 'zod';

const notionErrorSchema = z.object({
  status: z.number(),
  message: z.string(),
});

export function parseNotionError(error: unknown) {
  const { data: notionError } = notionErrorSchema.safeParse(error);
  return notionError;
}

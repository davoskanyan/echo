/* eslint-disable */
import { PersonalTask } from '@/entities/personalTask';

export function mapNotionTasks(db: any): Array<PersonalTask> {
  try {
    return db.map((row: any) => ({
      name: row.properties['Task name'].title[0].text.content,
      status: row.properties.Status.status.name,
      priority: row.properties['Priority API'].formula.string,
      project: row.properties['Project API'].formula.string,
      duration: row.properties.Duration.formula.string,
      dueStart: row.properties.Due.date?.start,
      dueEnd: row.properties.Due.date?.end,
    }));
  } catch {
    console.error('Error mapping Notion tasks');
    return [];
  }
}

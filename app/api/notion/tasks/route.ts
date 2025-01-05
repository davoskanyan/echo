import { Client } from '@notionhq/client';

const notionApiKey = process.env.NOTION_API_KEY;
const databaseId = process.env.NOTION_TASKS_DATABASE_ID as string;

const notion = new Client({ auth: notionApiKey });

const filteredStatuses = ['Archived', 'Done', 'Canceled'];

export const getDatabase = async (databaseId: string) => {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        and: filteredStatuses.map((status) => ({
          property: 'Status',
          status: {
            does_not_equal: status,
          },
        })),
      },
    });
    const db = response.results;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formatted = db.map((row: any) => ({
      name: row.properties['Task name'].title[0].text.content,
      status: row.properties.Status.status.name,
      priority: row.properties['Priority API'].formula.string,
      project: row.properties['Project API'].formula.string,
      duration: row.properties.Duration.formula.string,
      dueStart: row.properties.Due.date?.start,
      dueEnd: row.properties.Due.date?.end,
    }));
    return formatted;
  } catch (error) {
    console.error('Error fetching database:', error);
    return [];
  }
};

export async function GET() {
  const database = await getDatabase(databaseId);
  return Response.json(database);
}

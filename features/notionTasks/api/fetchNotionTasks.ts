import { notionClient } from '@/shared/notionClient';
import { NOTION_TASKS_DATABASE_ID } from '@/shared/consts';

import { mapNotionTasks } from '../utils/notionMapper';

const filteredStatuses = ['Archived', 'Done', 'Canceled'];

export async function fetchNotionTasks() {
  const response = await notionClient.databases.query({
    database_id: NOTION_TASKS_DATABASE_ID,
    filter: {
      and: filteredStatuses.map((status) => ({
        property: 'Status',
        status: {
          does_not_equal: status,
        },
      })),
    },
  });

  return mapNotionTasks(response.results);
}

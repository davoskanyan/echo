import { notionClient } from '@/shared/notionClient';
import { NOTION_TASKS_DATABASE_ID } from '@/shared/consts';

import { mapNotionTaskList } from '../utils/notionMapper';
import { NotionTaskResponse } from '../models/NotionTaskResponse';

const filteredStatuses = ['Archived', 'Done', 'Canceled'];

export async function getNotionTaskList() {
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

  return mapNotionTaskList(
    response.results as unknown as Array<NotionTaskResponse>,
  );
}

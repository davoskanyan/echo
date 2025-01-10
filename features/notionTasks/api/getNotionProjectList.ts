import { notionClient } from '@/shared/notionClient';
import { NOTION_PROJECTS_DATABASE_ID } from '@/shared/consts';

import { mapNotionProjectList } from '../utils/notionMapper';
import { NotionProjectResponse } from '../models/NotionProjectResponse';

const filteredStatuses = ['Archive', 'Done', 'Canceled'];

export async function getNotionProjectList() {
  const response = await notionClient.databases.query({
    database_id: NOTION_PROJECTS_DATABASE_ID,
    filter: {
      and: filteredStatuses.map((status) => ({
        property: 'Status',
        status: {
          does_not_equal: status,
        },
      })),
    },
  });

  return mapNotionProjectList(
    response.results as unknown as Array<NotionProjectResponse>,
  );
}

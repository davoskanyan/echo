import { Client } from '@notionhq/client';

const notionApiKey = process.env.NOTION_API_KEY;

export const notionClient = new Client({ auth: notionApiKey });

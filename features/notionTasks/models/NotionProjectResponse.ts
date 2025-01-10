export interface NotionProjectResponse {
  properties: {
    'Project name': {
      title: Array<{ text: { content: string } }>;
    };
  };
  id: string;
}

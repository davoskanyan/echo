export interface NotionTaskRowResponse {
  properties: {
    'Task name': {
      title: Array<{ text: { content: string } }>;
    };
    Status: {
      status: { name: string };
    };
    'Priority API': {
      formula: { string: string };
    };
    'Project API': {
      formula: { string: string };
    };
    Duration: {
      formula: { string: string };
    };
    Due: {
      date?: { start: string; end: string };
    };
  };
}

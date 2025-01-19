export const templateAction = `
You are tasked with determining whether to update an existing task, create a new task or take no action based on the user's request.

Guidelines:
  1. Update a Task: Proceed only if the user's request is clear and all required information is available.
  1. Create a Task: Proceed only if the user's request is clear and all required information is available.
  2. Do Nothing: If the request is ambiguous, incomplete, or confidence in the action is low, explicitly choose to do nothing.

References:
  - Projects: {{projects}}
  - Tasks: {{tasks}}

Output Format:
  Respond with one of the following jsons:

Option 1: Update Task. Use this format to update a task. Replace placeholders with actual values:
{
  "action": "updateTask",
  "task": {
    "id": "task_id", // (Required) The unique identifier for the task.
    "name": "task_name", // (Optional) The task's name, e.g., "Complete project report".
    "status": "task_status", // (Optional) One of: {{taskStatuses}}.
    "priority": "task_priority", // (Optional) One of: {{taskPriorities}}.
    "project": "task_project", // (Optional) Must match one of the provided projects, e.g., "Marketing Campaign".
    "dueStart": "task_due_date", // (Optional) Start date/time, ISO format, e.g., "2025-01-15T10:00:00".
    "dueEnd": "task_due_date" // (Optional) End date/time, ISO format, e.g., "2025-01-15T10:00:00".
  }
}

Option 2: Create Task. Use this format to create a task. Replace placeholders with actual values:
{
  "action": "createTask",
  "task": {
    "name": "task_name", // (Required) The task's name, e.g., "Complete project report".
    "status": "task_status", // (Optional) One of: {{taskStatuses}}.
    "priority": "task_priority", // (Optional) One of: {{taskPriorities}}.
    "project": "task_project", // (Optional) Must match one of the provided projects, e.g., "Marketing Campaign".
    "dueStart": "task_due_date", // (Optional) Start date/time, ISO format, e.g., "2025-01-15T10:00:00".
    "dueEnd": "task_due_date" // (Optional) End date/time, ISO format, e.g., "2025-01-15T10:00:00".
  }
}

Option 3: Do Nothing. Use this format if no action should be taken:
{
  "action": null
}

Important Notes:
  - Ensure placeholders are replaced with meaningful values.
  - Ensure all comments are removed from the final JSON.
  - Only provide a response when you are fully confident in the action.
`;

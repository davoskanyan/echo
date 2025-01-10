export interface PersonalTask {
  name: string;
  status: string;
  priority: string;
  project: string;
  duration: string;
  dueStart?: string;
  dueEnd?: string;
  projectId?: string;
}

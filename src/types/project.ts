export type ProjectStatus = "active" | "paused" | "completed" | "archived";

export type Project = {
  id: string;
  name: string;
  description: string;
  color: string;
  status: ProjectStatus;
  ownerId: string;
  memberIds: string[];
  defaultKanbanId: string | null;
  createdAt: unknown;
  updatedAt: unknown;
};
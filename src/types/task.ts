export type TaskStatus = "todo" | "doing" | "done" | "archived";
export type TaskPriority = "low" | "medium" | "high" | "urgent";

export type Task = {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string;
  ownerId: string;
  dueDate: string | null;
  order: number;
  createdAt: unknown;
  updatedAt: unknown;
  archivedAt?: unknown;
};
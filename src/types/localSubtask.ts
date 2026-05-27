export type LocalSubtaskStatus = "todo" | "doing" | "done";

export type LocalSubtask = {
  id: string;
  taskId: string;
  title: string;
  description: string;
  status: LocalSubtaskStatus;
  createdAt: string;
};
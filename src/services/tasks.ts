import { api } from "./api";
import type { Task, TaskPriority, TaskStatus } from "../types/task";

export type CreateTaskPayload = {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  order?: number;
  dependencyIds?: string[];
};

export type UpdateTaskPayload = Partial<CreateTaskPayload>;

export async function getTasksByProject(projectId: string) {
  const response = await api.get<Task[]>(`/projects/${projectId}/tasks`);
  return response.data;
}

export async function createTask(projectId: string, payload: CreateTaskPayload) {
  const response = await api.post<Task>(`/projects/${projectId}/tasks`, payload);
  return response.data;
}

export async function updateTask(taskId: string, payload: UpdateTaskPayload) {
  const response = await api.patch<Task>(`/tasks/${taskId}`, payload);
  return response.data;
}

export async function archiveTask(taskId: string) {
  const response = await api.delete(`/tasks/${taskId}`);
  return response.data;
}
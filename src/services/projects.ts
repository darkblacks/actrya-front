import { api } from "./api";
import type { Project } from "../types/project";

export type KanbanColumnType = "backlog" | "production" | "done" | "archived";

export type CreateProjectKanbanColumnPayload = {
  name: string;
  type: KanbanColumnType;
  order?: number;
};

export type CreateProjectPayload = {
  name: string;
  description?: string;
  color?: string;
  status?: "active" | "paused" | "completed" | "archived";
  kanbanColumns?: CreateProjectKanbanColumnPayload[];
};

export type UpdateProjectPayload = Partial<
  Omit<CreateProjectPayload, "kanbanColumns">
>;

export async function getProjects() {
  const response = await api.get<Project[]>("/projects");
  return response.data;
}

export async function getProject(projectId: string) {
  const response = await api.get<Project>(`/projects/${projectId}`);
  return response.data;
}

export async function createProject(payload: CreateProjectPayload) {
  const response = await api.post<Project>("/projects", payload);
  return response.data;
}

export async function updateProject(
  projectId: string,
  payload: UpdateProjectPayload
) {
  const response = await api.patch<Project>(`/projects/${projectId}`, payload);
  return response.data;
}

export async function archiveProject(projectId: string) {
  const response = await api.delete(`/projects/${projectId}`);
  return response.data;
}
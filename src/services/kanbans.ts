import { api } from "./api";

export type KanbanOwnerType = "project" | "task";

export type KanbanColumnType = "backlog" | "production" | "done" | "archived";

export type Kanban = {
  id: string;
  projectId: string;
  ownerType: KanbanOwnerType;
  ownerId: string;
  name: string;
  description: string;
  isDefault: boolean;
  createdAt: unknown;
  updatedAt: unknown;
};

export type KanbanColumn = {
  id: string;
  projectId: string;
  kanbanId: string;
  name: string;
  key: string;
  type?: KanbanColumnType;
  order: number;
  isInitial: boolean;
  isFinal: boolean;
  createdAt: unknown;
  updatedAt: unknown;
};

export type CreateKanbanPayload = {
  ownerType: KanbanOwnerType;
  ownerId: string;
  name?: string;
  description?: string;
};

export type CreateColumnPayload = {
  name: string;
  key?: string;
  order?: number;
  isInitial?: boolean;
  isFinal?: boolean;
};

export type UpdateColumnPayload = Partial<CreateColumnPayload>;

export async function getKanbansByProject(projectId: string) {
  const response = await api.get<Kanban[]>(`/projects/${projectId}/kanbans`);
  return response.data;
}

export async function getKanbansByTask(taskId: string) {
  const response = await api.get<Kanban[]>(`/tasks/${taskId}/kanbans`);
  return response.data;
}

export async function getKanbanColumns(kanbanId: string) {
  const response = await api.get<KanbanColumn[]>(
    `/kanbans/${kanbanId}/columns`
  );
  return response.data;
}

export async function createKanban(
  projectId: string,
  payload: CreateKanbanPayload
) {
  const response = await api.post<Kanban>(
    `/projects/${projectId}/kanbans`,
    payload
  );

  return response.data;
}

export async function createKanbanColumn(
  kanbanId: string,
  payload: CreateColumnPayload
) {
  const response = await api.post<KanbanColumn>(
    `/kanbans/${kanbanId}/columns`,
    payload
  );

  return response.data;
}

export async function updateKanbanColumn(
  columnId: string,
  payload: UpdateColumnPayload
) {
  const response = await api.patch<KanbanColumn>(
    `/columns/${columnId}`,
    payload
  );

  return response.data;
}
import type { LocalSubtask, LocalSubtaskStatus } from "../types/localSubtask";

const STORAGE_KEY = "@actrya:local-subtasks";

function getAllSubtasks(): LocalSubtask[] {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) return [];

  try {
    return JSON.parse(raw) as LocalSubtask[];
  } catch {
    return [];
  }
}

function saveAllSubtasks(subtasks: LocalSubtask[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(subtasks));
}

export function getLocalSubtasksByTask(taskId: string) {
  return getAllSubtasks().filter((subtask) => subtask.taskId === taskId);
}

export function createLocalSubtask(params: {
  taskId: string;
  title: string;
  description?: string;
}) {
  const subtasks = getAllSubtasks();

  const newSubtask: LocalSubtask = {
    id: crypto.randomUUID(),
    taskId: params.taskId,
    title: params.title,
    description: params.description ?? "",
    status: "todo",
    createdAt: new Date().toISOString(),
  };

  saveAllSubtasks([...subtasks, newSubtask]);

  return newSubtask;
}

export function updateLocalSubtaskStatus(
  subtaskId: string,
  status: LocalSubtaskStatus
) {
  const subtasks = getAllSubtasks();

  const updated = subtasks.map((subtask) =>
    subtask.id === subtaskId ? { ...subtask, status } : subtask
  );

  saveAllSubtasks(updated);

  return updated.find((subtask) => subtask.id === subtaskId) ?? null;
}
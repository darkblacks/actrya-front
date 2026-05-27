import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AppLayout from "../../../components/layout/AppLayout";
import { archiveProject, getProject } from "../../../services/projects";
import {
  archiveTask,
  createTask,
  getTasksByProject,
  updateTask,
} from "../../../services/tasks";

import type { Project } from "../../../types/project";
import type { Task, TaskPriority, TaskStatus } from "../../../types/task";

import ProjectHeader from "./components/ProjectHeader/ProjectHeader";
import ProjectKanban from "./components/ProjectKanban/ProjectKanban";
import CreateTaskModal from "./components/CreateTaskModal/CreateTaskModal";
import TaskDrawer from "./components/TaskDrawer/TaskDrawer";

import "./ProjectPage.css";

export type LocalSubtaskStatus = "todo" | "doing" | "done";

export type LocalSubtask = {
  id: string;
  taskId: string;
  title: string;
  description: string;
  status: LocalSubtaskStatus;
  createdAt: string;
};

const LOCAL_SUBTASKS_KEY = "@actrya:task-local-subtasks";

function getAllLocalSubtasks(): LocalSubtask[] {
  const raw = localStorage.getItem(LOCAL_SUBTASKS_KEY);

  if (!raw) return [];

  try {
    return JSON.parse(raw) as LocalSubtask[];
  } catch {
    return [];
  }
}

function saveAllLocalSubtasks(subtasks: LocalSubtask[]) {
  localStorage.setItem(LOCAL_SUBTASKS_KEY, JSON.stringify(subtasks));
}

function getLocalSubtasksByTask(taskId: string) {
  return getAllLocalSubtasks().filter((subtask) => subtask.taskId === taskId);
}

function createLocalSubtask(params: {
  taskId: string;
  title: string;
  description?: string;
}) {
  const allSubtasks = getAllLocalSubtasks();

  const newSubtask: LocalSubtask = {
    id: crypto.randomUUID(),
    taskId: params.taskId,
    title: params.title,
    description: params.description ?? "",
    status: "todo",
    createdAt: new Date().toISOString(),
  };

  saveAllLocalSubtasks([...allSubtasks, newSubtask]);

  return newSubtask;
}

function updateLocalSubtaskStatus(
  subtaskId: string,
  status: LocalSubtaskStatus
) {
  const allSubtasks = getAllLocalSubtasks();

  const updatedSubtasks = allSubtasks.map((subtask) =>
    subtask.id === subtaskId ? { ...subtask, status } : subtask
  );

  saveAllLocalSubtasks(updatedSubtasks);
}

function deleteLocalSubtask(subtaskId: string) {
  const allSubtasks = getAllLocalSubtasks();
  const updatedSubtasks = allSubtasks.filter(
    (subtask) => subtask.id !== subtaskId
  );

  saveAllLocalSubtasks(updatedSubtasks);
}

function ProjectPage() {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [localSubtasks, setLocalSubtasks] = useState<LocalSubtask[]>([]);

  const [errorMessage, setErrorMessage] = useState("");

  async function loadProjectData() {
    if (!projectId) return;

    setIsLoading(true);
    setErrorMessage("");

    try {
      const [projectData, tasksData] = await Promise.all([
        getProject(projectId),
        getTasksByProject(projectId),
      ]);

      setProject(projectData);
      setTasks(tasksData.filter((task) => task.status !== "archived"));
    } catch (error) {
      console.error("Erro ao carregar projeto:", error);
      setErrorMessage("Não foi possível carregar este projeto.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreateTask(params: {
    title: string;
    description: string;
    priority: TaskPriority;
    dependencyIds: string[];
  }) {
    if (!projectId) return;

    setErrorMessage("");

    try {
      await createTask(projectId, {
        title: params.title,
        description: params.description,
        priority: params.priority,
        status: "todo",
        order: tasks.length,
        dependencyIds: params.dependencyIds,
      });

      setIsCreateTaskOpen(false);
      await loadProjectData();
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
      setErrorMessage("Não foi possível criar a tarefa.");
    }
  }

  function isTaskBlocked(task: Task) {
    if (!task.dependencyIds || task.dependencyIds.length === 0) return false;

    return task.dependencyIds.some((dependencyId) => {
      const dependency = tasks.find((item) => item.id === dependencyId);
      return !dependency || dependency.status !== "done";
    });
  }

  function getBlockedReason(task: Task) {
    if (!task.dependencyIds || task.dependencyIds.length === 0) return "";

    const pendingDependencies = task.dependencyIds
      .map((dependencyId) => tasks.find((item) => item.id === dependencyId))
      .filter((dependency): dependency is Task => Boolean(dependency))
      .filter((dependency) => dependency.status !== "done");

    if (pendingDependencies.length === 0) return "";

    return `Depende de: ${pendingDependencies
      .map((dependency) => dependency.title)
      .join(", ")}`;
  }

  async function handleMoveTask(task: Task, targetStatus: TaskStatus) {
    if (targetStatus !== "todo" && isTaskBlocked(task)) {
      setErrorMessage(`Tarefa bloqueada. ${getBlockedReason(task)}.`);
      return;
    }

    setErrorMessage("");

    try {
      await updateTask(task.id, {
        status: targetStatus,
      });

      setTasks((currentTasks) =>
        currentTasks.map((item) =>
          item.id === task.id ? { ...item, status: targetStatus } : item
        )
      );

      if (selectedTask?.id === task.id) {
        setSelectedTask({ ...task, status: targetStatus });
      }
    } catch (error) {
      console.error("Erro ao mover tarefa:", error);
      setErrorMessage("Não foi possível mover a tarefa.");
    }
  }

  async function handleDeleteTask(task: Task) {
    const confirmDelete = window.confirm(
      `Tem certeza que deseja arquivar a tarefa "${task.title}"?`
    );

    if (!confirmDelete) return;

    setErrorMessage("");

    try {
      await archiveTask(task.id);

      setTasks((currentTasks) =>
        currentTasks.filter((item) => item.id !== task.id)
      );

      if (selectedTask?.id === task.id) {
        setSelectedTask(null);
      }
    } catch (error) {
      console.error("Erro ao arquivar tarefa:", error);
      setErrorMessage("Não foi possível arquivar a tarefa.");
    }
  }

  async function handleDeleteProject() {
    if (!project || !projectId) return;

    const confirmDelete = window.confirm(
      `Tem certeza que deseja arquivar o projeto "${project.name}"?`
    );

    if (!confirmDelete) return;

    setErrorMessage("");

    try {
      await archiveProject(projectId);
      navigate("/app");
    } catch (error) {
      console.error("Erro ao arquivar projeto:", error);
      setErrorMessage("Não foi possível arquivar o projeto.");
    }
  }

  function handleOpenTask(task: Task) {
    setSelectedTask(task);
    setLocalSubtasks(getLocalSubtasksByTask(task.id));
  }

  function handleCloseTask() {
    setSelectedTask(null);
  }

  function handleCreateSubtask(params: {
    title: string;
    description: string;
  }) {
    if (!selectedTask) return;

    createLocalSubtask({
      taskId: selectedTask.id,
      title: params.title,
      description: params.description,
    });

    setLocalSubtasks(getLocalSubtasksByTask(selectedTask.id));
  }

  function handleMoveSubtask(
    subtask: LocalSubtask,
    targetStatus: LocalSubtaskStatus
  ) {
    if (!selectedTask) return;

    updateLocalSubtaskStatus(subtask.id, targetStatus);
    setLocalSubtasks(getLocalSubtasksByTask(selectedTask.id));
  }

  function handleDeleteSubtask(subtask: LocalSubtask) {
    const confirmDelete = window.confirm(
      `Tem certeza que deseja excluir a etapa "${subtask.title}"?`
    );

    if (!confirmDelete || !selectedTask) return;

    deleteLocalSubtask(subtask.id);
    setLocalSubtasks(getLocalSubtasksByTask(selectedTask.id));
  }

  const activeTasks = tasks.filter((task) => task.status !== "archived");
  const doneTasks = activeTasks.filter((task) => task.status === "done");

  const progress = useMemo(() => {
    if (activeTasks.length === 0) return 0;
    return Math.round((doneTasks.length / activeTasks.length) * 100);
  }, [activeTasks.length, doneTasks.length]);

  useEffect(() => {
    loadProjectData();
  }, [projectId]);

  if (isLoading) {
    return (
      <AppLayout>
        <main className="project-page">
          <div className="project-page__loading">Carregando projeto...</div>
        </main>
      </AppLayout>
    );
  }

  if (!project) {
    return (
      <AppLayout>
        <main className="project-page">
          <div className="project-page__loading">Projeto não encontrado.</div>
        </main>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <main className="project-page">
        <ProjectHeader
          project={project}
          progress={progress}
          onCreateTask={() => setIsCreateTaskOpen(true)}
          onDeleteProject={handleDeleteProject}
        />

        {errorMessage && <p className="project-page__error">{errorMessage}</p>}

        <ProjectKanban
          tasks={tasks}
          isTaskBlocked={isTaskBlocked}
          getBlockedReason={getBlockedReason}
          onOpenTask={handleOpenTask}
          onMoveTask={handleMoveTask}
          onDeleteTask={handleDeleteTask}
        />
      </main>

      {isCreateTaskOpen && (
        <CreateTaskModal
          tasks={tasks}
          onClose={() => setIsCreateTaskOpen(false)}
          onCreate={handleCreateTask}
        />
      )}

      {selectedTask && (
        <TaskDrawer
          task={selectedTask}
          subtasks={localSubtasks}
          onClose={handleCloseTask}
          onCreateSubtask={handleCreateSubtask}
          onMoveSubtask={handleMoveSubtask}
          onDeleteSubtask={handleDeleteSubtask}
        />
      )}
    </AppLayout>
  );
}

export default ProjectPage;
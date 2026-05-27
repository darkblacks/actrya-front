import type { Task, TaskStatus } from "../../../../../types/task";
import TaskCard from "../TaskCard/TaskCard";
import "./ProjectKanban.css";

const TASK_COLUMNS: {
  title: string;
  status: TaskStatus;
  description: string;
}[] = [
  {
    title: "A fazer",
    status: "todo",
    description: "Tarefas planejadas para iniciar.",
  },
  {
    title: "Fazendo",
    status: "doing",
    description: "Tarefas em execução agora.",
  },
  {
    title: "Concluído",
    status: "done",
    description: "Tarefas finalizadas.",
  },
];

type ProjectKanbanProps = {
  tasks: Task[];
  isTaskBlocked: (task: Task) => boolean;
  getBlockedReason: (task: Task) => string;
  onOpenTask: (task: Task) => void;
  onMoveTask: (task: Task, targetStatus: TaskStatus) => void;
  onDeleteTask: (task: Task) => void;
};

function ProjectKanban({
  tasks,
  isTaskBlocked,
  getBlockedReason,
  onOpenTask,
  onMoveTask,
  onDeleteTask,
}: ProjectKanbanProps) {
  return (
    <section className="project-kanban">
      {TASK_COLUMNS.map((column) => {
        const columnTasks = tasks.filter((task) => task.status === column.status);

        return (
          <div key={column.status} className="project-kanban__column">
            <header className="project-kanban__column-head">
              <div>
                <h2>{column.title}</h2>
                <p>{column.description}</p>
              </div>

              <span>{columnTasks.length}</span>
            </header>

            <div className="project-kanban__column-body">
              {columnTasks.length === 0 && (
                <div className="project-kanban__empty">Nenhuma tarefa aqui.</div>
              )}

              {columnTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  blocked={isTaskBlocked(task)}
                  blockedReason={getBlockedReason(task)}
                  onOpen={onOpenTask}
                  onMove={onMoveTask}
                  onDelete={onDeleteTask}
                />
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}

export default ProjectKanban;
import { ArrowLeft, ArrowRight, Layers3, Lock, Trash2 } from "lucide-react";
import type { Task, TaskStatus } from "../../../../../types/task";
import "./TaskCard.css";

const FLOW: TaskStatus[] = ["todo", "doing", "done"];

type TaskCardProps = {
  task: Task;
  blocked: boolean;
  blockedReason: string;
  onOpen: (task: Task) => void;
  onMove: (task: Task, targetStatus: TaskStatus) => void;
  onDelete: (task: Task) => void;
};

function TaskCard({
  task,
  blocked,
  blockedReason,
  onOpen,
  onMove,
  onDelete,
}: TaskCardProps) {
  const currentIndex = FLOW.indexOf(task.status);
  const previousStatus = FLOW[currentIndex - 1];
  const nextStatus = FLOW[currentIndex + 1];

  return (
    <article className={`task-card ${blocked ? "task-card--blocked" : ""}`}>
      <div className="task-card__top">
        <button type="button" onClick={() => onOpen(task)}>
          <Layers3 size={16} />
          Abrir tarefa
        </button>

        <span className={`task-card__priority task-card__priority--${task.priority}`}>
          {task.priority}
        </span>
      </div>

      <h3>{task.title}</h3>

      <p>{task.description || "Sem descrição."}</p>

      {blocked && (
        <div className="task-card__blocked">
          <Lock size={14} />
          <span>{blockedReason || "Tarefa bloqueada por dependência."}</span>
        </div>
      )}

      <footer className="task-card__actions">
        <button
          type="button"
          disabled={!previousStatus}
          onClick={() => previousStatus && onMove(task, previousStatus)}
        >
          <ArrowLeft size={14} />
          Voltar
        </button>

        <button
          type="button"
          disabled={!nextStatus || (blocked && nextStatus !== "todo")}
          onClick={() => nextStatus && onMove(task, nextStatus)}
        >
          Avançar
          <ArrowRight size={14} />
        </button>

        <button
          type="button"
          className="task-card__delete-btn"
          onClick={() => onDelete(task)}
        >
          <Trash2 size={14} />
          Excluir
        </button>
      </footer>
    </article>
  );
}

export default TaskCard;
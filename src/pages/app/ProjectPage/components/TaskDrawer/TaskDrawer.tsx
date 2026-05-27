import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Trash2, X } from "lucide-react";
import type { Task } from "../../../../../types/task";
import type { LocalSubtask, LocalSubtaskStatus } from "../../ProjectPage";
import "./TaskDrawer.css";

const SUBTASK_FLOW: LocalSubtaskStatus[] = ["todo", "doing", "done"];

const SUBTASK_COLUMNS: {
  title: string;
  status: LocalSubtaskStatus;
}[] = [
  {
    title: "A fazer",
    status: "todo",
  },
  {
    title: "Fazendo",
    status: "doing",
  },
  {
    title: "Concluído",
    status: "done",
  },
];

type TaskDrawerProps = {
  task: Task;
  subtasks: LocalSubtask[];
  onClose: () => void;
  onCreateSubtask: (params: {
    title: string;
    description: string;
  }) => void;
  onMoveSubtask: (
    subtask: LocalSubtask,
    targetStatus: LocalSubtaskStatus
  ) => void;
  onDeleteSubtask: (subtask: LocalSubtask) => void;
};

function TaskDrawer({
  task,
  subtasks,
  onClose,
  onCreateSubtask,
  onMoveSubtask,
  onDeleteSubtask,
}: TaskDrawerProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const progress = useMemo(() => {
    if (subtasks.length === 0) return 0;

    const done = subtasks.filter((subtask) => subtask.status === "done");

    return Math.round((done.length / subtasks.length) * 100);
  }, [subtasks]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) return;

    onCreateSubtask({
      title: title.trim(),
      description: description.trim(),
    });

    setTitle("");
    setDescription("");
  }

  return (
    <div className="task-drawer-backdrop">
      <aside className="task-drawer">
        <div className="task-drawer__head">
          <div>
            <small>Tarefa aberta</small>
            <h2>{task.title}</h2>
          </div>

          <button type="button" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <p>{task.description || "Sem descrição."}</p>

        <section className="task-drawer__progress">
          <strong>{progress}%</strong>
          <span>progresso interno da tarefa</span>

          <div className="task-drawer__progress-bar">
            <div style={{ width: `${progress}%` }} />
          </div>
        </section>

        <section className="task-drawer__subtasks">
          <div className="task-drawer__section-head">
            <h3>Etapas internas</h3>
            <span>{subtasks.length} etapas</span>
          </div>

          <form onSubmit={handleSubmit} className="subtask-form">
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Ex: Instalar NestJS local"
              required
            />

            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Descrição da etapa"
            />

            <button type="submit">Criar etapa</button>
          </form>

          <div className="subtask-kanban">
            {SUBTASK_COLUMNS.map((column) => {
              const columnSubtasks = subtasks.filter(
                (subtask) => subtask.status === column.status
              );

              return (
                <div key={column.status} className="subtask-column">
                  <header>
                    <strong>{column.title}</strong>
                    <span>{columnSubtasks.length}</span>
                  </header>

                  <div className="subtask-column__body">
                    {columnSubtasks.length === 0 && (
                      <div className="subtask-column__empty">Vazio</div>
                    )}

                    {columnSubtasks.map((subtask) => {
                      const currentIndex = SUBTASK_FLOW.indexOf(subtask.status);
                      const previousStatus = SUBTASK_FLOW[currentIndex - 1];
                      const nextStatus = SUBTASK_FLOW[currentIndex + 1];

                      return (
                        <article key={subtask.id} className="subtask-card">
                          <h4>{subtask.title}</h4>

                          <p>{subtask.description || "Sem descrição."}</p>

                          <div className="subtask-card__actions">
                            <button
                              type="button"
                              disabled={!previousStatus}
                              onClick={() =>
                                previousStatus &&
                                onMoveSubtask(subtask, previousStatus)
                              }
                            >
                              <ArrowLeft size={13} />
                              Voltar
                            </button>

                            <button
                              type="button"
                              disabled={!nextStatus}
                              onClick={() =>
                                nextStatus && onMoveSubtask(subtask, nextStatus)
                              }
                            >
                              Avançar
                              <ArrowRight size={13} />
                            </button>

                            <button
                              type="button"
                              className="subtask-card__delete-btn"
                              onClick={() => onDeleteSubtask(subtask)}
                            >
                              <Trash2 size={13} />
                              Excluir
                            </button>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </aside>
    </div>
  );
}

export default TaskDrawer;
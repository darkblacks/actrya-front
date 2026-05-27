import { useState } from "react";
import { X } from "lucide-react";
import type { Task, TaskPriority } from "../../../../../types/task";
import "./CreateTaskModal.css";

type CreateTaskModalProps = {
  tasks: Task[];
  onClose: () => void;
  onCreate: (params: {
    title: string;
    description: string;
    priority: TaskPriority;
    dependencyIds: string[];
  }) => void;
};

function CreateTaskModal({ tasks, onClose, onCreate }: CreateTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [dependencyIds, setDependencyIds] = useState<string[]>([]);

  const availableDependencies = tasks.filter(
    (task) => task.status !== "archived"
  );

  function handleToggleDependency(taskId: string) {
    setDependencyIds((current) =>
      current.includes(taskId)
        ? current.filter((id) => id !== taskId)
        : [...current, taskId]
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) return;

    onCreate({
      title: title.trim(),
      description: description.trim(),
      priority,
      dependencyIds,
    });
  }

  return (
    <div className="create-task-backdrop">
      <section className="create-task-modal">
        <div className="create-task-modal__head">
          <div>
            <small>Nova tarefa</small>
            <h2>Criar tarefa</h2>
          </div>

          <button type="button" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <p>
          Crie uma tarefa principal no Kanban do projeto. Você pode definir
          dependências para impedir que ela avance antes de outra tarefa ser
          concluída.
        </p>

        <form onSubmit={handleSubmit}>
          <label>
            Título
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Ex: Integrar Axios"
              required
            />
          </label>

          <label>
            Descrição
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Explique o que precisa ser feito"
            />
          </label>

          <label>
            Prioridade
            <select
              value={priority}
              onChange={(event) => setPriority(event.target.value as TaskPriority)}
            >
              <option value="low">Baixa</option>
              <option value="medium">Média</option>
              <option value="high">Alta</option>
              <option value="urgent">Urgente</option>
            </select>
          </label>

          <section className="create-task-dependencies">
            <div>
              <h3>Depende de</h3>
              <p>
                Marque as tarefas que precisam estar concluídas antes desta
                avançar.
              </p>
            </div>

            {availableDependencies.length === 0 && (
              <span className="create-task-dependencies__empty">
                Nenhuma tarefa disponível para dependência.
              </span>
            )}

            {availableDependencies.map((task) => (
              <label key={task.id} className="create-task-dependency-item">
                <input
                  type="checkbox"
                  checked={dependencyIds.includes(task.id)}
                  onChange={() => handleToggleDependency(task.id)}
                />

                <span>
                  <strong>{task.title}</strong>
                  <small>Status: {task.status}</small>
                </span>
              </label>
            ))}
          </section>

          <div className="create-task-modal__actions">
            <button
              type="button"
              className="create-task-btn create-task-btn--secondary"
              onClick={onClose}
            >
              Cancelar
            </button>

            <button type="submit" className="create-task-btn create-task-btn--primary">
              Criar tarefa
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default CreateTaskModal;
import { useState } from "react";
import {
  Archive,
  CheckCircle2,
  Columns3,
  LayoutDashboard,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { createProject } from "../../services/projects";
import type { Project } from "../../types/project";
import "./CreateProject.css";

type CreateProjectProps = {
  onClose: () => void;
  onCreated: (project: Project) => void;
};

type KanbanMode = "default" | "custom";

type KanbanColumnType = "backlog" | "production" | "done" | "archived";

type KanbanColumnDraft = {
  name: string;
  type: KanbanColumnType;
};

const DEFAULT_KANBAN_COLUMNS: KanbanColumnDraft[] = [
  { name: "Backlog", type: "backlog" },
  { name: "A Fazer", type: "production" },
  { name: "Em andamento", type: "production" },
  { name: "Concluído", type: "done" },
];

const COLUMN_TYPE_OPTIONS: {
  value: KanbanColumnType;
  label: string;
  description: string;
}[] = [
  {
    value: "backlog",
    label: "Coluna de Backlog",
    description: "Ideias, pendências e tarefas ainda não iniciadas.",
  },
  {
    value: "production",
    label: "Coluna de Produção",
    description: "Etapas onde o trabalho está sendo executado.",
  },
  {
    value: "done",
    label: "Concluído",
    description: "Tarefas finalizadas e entregues.",
  },
  {
    value: "archived",
    label: "Arquivado",
    description: "Tarefas removidas do fluxo principal.",
  },
];

function getColumnTypeLabel(type: KanbanColumnType) {
  return (
    COLUMN_TYPE_OPTIONS.find((option) => option.value === type)?.label ??
    "Coluna"
  );
}

function getColumnTypeIcon(type: KanbanColumnType) {
  if (type === "done") return <CheckCircle2 size={16} />;
  if (type === "archived") return <Archive size={16} />;
  return <Columns3 size={16} />;
}

function CreateProject({ onClose, onCreated }: CreateProjectProps) {
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectColor, setProjectColor] = useState("#7C3AED");

  const [kanbanMode, setKanbanMode] = useState<KanbanMode>("default");
  const [isColumnPopupOpen, setIsColumnPopupOpen] = useState(false);
  const [customColumns, setCustomColumns] = useState<KanbanColumnDraft[]>(
    DEFAULT_KANBAN_COLUMNS
  );

  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function handleSelectDefaultKanban() {
    setKanbanMode("default");
    setIsColumnPopupOpen(false);
    setErrorMessage("");
  }

  function handleSelectCustomKanban() {
    setKanbanMode("custom");
    setIsColumnPopupOpen(true);
    setErrorMessage("");
  }

  function handleChangeColumnName(index: number, value: string) {
    setCustomColumns((currentColumns) =>
      currentColumns.map((column, columnIndex) =>
        columnIndex === index ? { ...column, name: value } : column
      )
    );
  }

  function handleChangeColumnType(index: number, value: KanbanColumnType) {
    setCustomColumns((currentColumns) =>
      currentColumns.map((column, columnIndex) =>
        columnIndex === index ? { ...column, type: value } : column
      )
    );
  }

  function handleAddColumn() {
    setCustomColumns((currentColumns) => [
      ...currentColumns,
      {
        name: "",
        type: "production",
      },
    ]);
  }

  function handleRemoveColumn(index: number) {
    setCustomColumns((currentColumns) =>
      currentColumns.filter((_, columnIndex) => columnIndex !== index)
    );
  }

  function handleSaveColumns() {
    const hasValidColumn = customColumns.some((column) => column.name.trim());

    if (!hasValidColumn) {
      setErrorMessage("Adicione pelo menos uma coluna ao Kanban.");
      return;
    }

    setErrorMessage("");
    setIsColumnPopupOpen(false);
  }

  async function handleCreateProject(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!projectName.trim()) {
      setErrorMessage("Informe um nome para o projeto.");
      return;
    }

    const selectedColumns =
      kanbanMode === "default" ? DEFAULT_KANBAN_COLUMNS : customColumns;

    const cleanColumns = selectedColumns
      .map((column, index) => ({
        name: column.name.trim(),
        type: column.type,
        order: index + 1,
      }))
      .filter((column) => column.name);

    if (cleanColumns.length === 0) {
      setErrorMessage("Adicione pelo menos uma coluna ao Kanban.");
      return;
    }

    const token = localStorage.getItem("@actrya:token");

    if (!token) {
      setErrorMessage(
        "Sua sessão não foi encontrada. Faça login novamente para criar projetos."
      );
      return;
    }

    setIsCreatingProject(true);
    setErrorMessage("");

    try {
      const createdProject = await createProject({
        name: projectName.trim(),
        description: projectDescription.trim(),
        color: projectColor,
        status: "active",
        kanbanColumns: cleanColumns,
      });

      onCreated(createdProject);
    } catch (error) {
      console.error("Erro ao criar projeto:", error);
      setErrorMessage("Não foi possível criar o projeto.");
    } finally {
      setIsCreatingProject(false);
    }
  }

  return (
    <>
      <div className="create-project-backdrop">
        <section className="create-project-modal">
          <div className="create-project-modal__head">
            <div>
              <small>Novo projeto</small>
              <h2>Criar projeto</h2>
            </div>

            <button type="button" onClick={onClose}>
              <X size={18} />
            </button>
          </div>

          <p>
            Crie um projeto e escolha como o Kanban principal será iniciado.
          </p>

          <form onSubmit={handleCreateProject}>
            <label>
              Nome do projeto
              <input
                value={projectName}
                onChange={(event) => setProjectName(event.target.value)}
                placeholder="Ex: Criar Backend"
                required
              />
            </label>

            <label>
              Descrição
              <textarea
                value={projectDescription}
                onChange={(event) =>
                  setProjectDescription(event.target.value)
                }
                placeholder="Explique o objetivo deste projeto"
              />
            </label>

            <label>
              Cor do projeto
              <input
                type="color"
                value={projectColor}
                onChange={(event) => setProjectColor(event.target.value)}
              />
            </label>

            <section className="create-project-kanban-picker">
              <div>
                <h3>Modelo do Kanban</h3>
                <p>Escolha uma estrutura padrão ou personalize suas colunas.</p>
              </div>

              <div className="create-project-kanban-cards">
                <button
                  type="button"
                  className={
                    kanbanMode === "default"
                      ? "create-project-kanban-card create-project-kanban-card--active"
                      : "create-project-kanban-card"
                  }
                  onClick={handleSelectDefaultKanban}
                >
                  <div className="create-project-kanban-card__image">
                    <LayoutDashboard size={34} />

                    <div>
                      <span className="create-project-kanban-card__bar create-project-kanban-card__bar--backlog" />
                      <span className="create-project-kanban-card__bar create-project-kanban-card__bar--production" />
                      <span className="create-project-kanban-card__bar create-project-kanban-card__bar--production" />
                      <span className="create-project-kanban-card__bar create-project-kanban-card__bar--done" />
                    </div>
                  </div>

                  <strong>Criar Kanban padrão</strong>
                  <small>
                    Backlog, A Fazer, Em andamento e Concluído.
                  </small>
                </button>

                <button
                  type="button"
                  className={
                    kanbanMode === "custom"
                      ? "create-project-kanban-card create-project-kanban-card--active"
                      : "create-project-kanban-card"
                  }
                  onClick={handleSelectCustomKanban}
                >
                  <div className="create-project-kanban-card__image">
                    <Columns3 size={34} />

                    <div>
                      <span className="create-project-kanban-card__bar create-project-kanban-card__bar--backlog" />
                      <span className="create-project-kanban-card__bar create-project-kanban-card__bar--production" />
                      <span className="create-project-kanban-card__bar create-project-kanban-card__bar--done" />
                      <span className="create-project-kanban-card__bar create-project-kanban-card__bar--archived" />
                    </div>
                  </div>

                  <strong>Criar minhas próprias colunas</strong>
                  <small>
                    Personalize nome, tipo e função visual das colunas.
                  </small>
                </button>
              </div>
            </section>

            {kanbanMode === "custom" && (
              <div className="create-project-selected-columns">
                {customColumns
                  .filter((column) => column.name.trim())
                  .map((column, index) => (
                    <span
                      key={`${column.name}-${index}`}
                      className={`create-project-column-chip create-project-column-chip--${column.type}`}
                    >
                      {column.name}
                    </span>
                  ))}

                <button type="button" onClick={() => setIsColumnPopupOpen(true)}>
                  Editar colunas
                </button>
              </div>
            )}

            {errorMessage && (
              <p className="create-project-error">{errorMessage}</p>
            )}

            <div className="create-project-modal__actions">
              <button
                type="button"
                className="create-project-btn create-project-btn--secondary"
                onClick={onClose}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="create-project-btn create-project-btn--primary"
                disabled={isCreatingProject}
              >
                {isCreatingProject ? "Criando..." : "Criar projeto"}
              </button>
            </div>
          </form>
        </section>
      </div>

      {isColumnPopupOpen && (
        <div className="create-columns-backdrop">
          <section className="create-columns-modal">
            <div className="create-columns-modal__head">
              <div>
                <small>Kanban personalizado</small>
                <h2>Configurar colunas</h2>
              </div>

              <button type="button" onClick={() => setIsColumnPopupOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <p>
              Defina o nome e o tipo de cada coluna. O tipo controla a cor e a
              função visual dentro do Kanban.
            </p>

            <div className="create-columns-modal__legend">
              <span className="create-columns-modal__legend-item create-columns-modal__legend-item--backlog">
                Backlog
              </span>
              <span className="create-columns-modal__legend-item create-columns-modal__legend-item--production">
                Produção
              </span>
              <span className="create-columns-modal__legend-item create-columns-modal__legend-item--done">
                Concluído
              </span>
              <span className="create-columns-modal__legend-item create-columns-modal__legend-item--archived">
                Arquivado
              </span>
            </div>

            <div className="create-columns-modal__scroll">
              {customColumns.map((column, index) => (
                <article
                  key={index}
                  className={`create-column-config create-column-config--${column.type}`}
                >
                  <div className="create-column-config__color" />

                  <div className="create-column-config__body">
                    <div className="create-column-config__top">
                      <span>
                        {getColumnTypeIcon(column.type)}
                        {getColumnTypeLabel(column.type)}
                      </span>

                      {customColumns.length > 1 && (
                        <button
                          type="button"
                          className="create-column-config__remove"
                          onClick={() => handleRemoveColumn(index)}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>

                    <div className="create-column-config__fields">
                      <label>
                        Nome da coluna
                        <input
                          value={column.name}
                          onChange={(event) =>
                            handleChangeColumnName(index, event.target.value)
                          }
                          placeholder="Ex: Em revisão"
                        />
                      </label>

                      <label>
                        Tipo da coluna
                        <select
                          value={column.type}
                          onChange={(event) =>
                            handleChangeColumnType(
                              index,
                              event.target.value as KanbanColumnType
                            )
                          }
                        >
                          {COLUMN_TYPE_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <small className="create-column-config__description">
                      {
                        COLUMN_TYPE_OPTIONS.find(
                          (option) => option.value === column.type
                        )?.description
                      }
                    </small>
                  </div>
                </article>
              ))}
            </div>

            <div className="create-columns-modal__actions">
              <button
                type="button"
                className="create-project-btn create-project-btn--secondary"
                onClick={handleAddColumn}
              >
                <Plus size={16} />
                Adicionar coluna
              </button>

              <button
                type="button"
                className="create-project-btn create-project-btn--primary"
                onClick={handleSaveColumns}
              >
                Salvar colunas
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

export default CreateProject;
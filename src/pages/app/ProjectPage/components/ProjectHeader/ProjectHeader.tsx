import { Plus, Trash2 } from "lucide-react";
import type { Project } from "../../../../../types/project";
import "./ProjectHeader.css";

type ProjectHeaderProps = {
  project: Project;
  progress: number;
  onCreateTask: () => void;
  onDeleteProject: () => void;
};

function ProjectHeader({
  project,
  progress,
  onCreateTask,
  onDeleteProject,
}: ProjectHeaderProps) {
  return (
    <section className="project-header">
      <div className="project-header__content">
        <span
          className="project-header__color"
          style={{ background: project.color || "#7C3AED" }}
        />

        <small>Projeto ativo</small>

        <h1>{project.name}</h1>

        <p>{project.description || "Projeto sem descrição."}</p>
      </div>

      <aside className="project-header__progress-card">
        <span>Progresso do projeto</span>

        <strong>{progress}%</strong>

        <div className="project-header__progress-bar">
          <div style={{ width: `${progress}%` }} />
        </div>

        <div className="project-header__actions">
          <button
            type="button"
            className="project-header__primary-btn"
            onClick={onCreateTask}
          >
            <Plus size={17} />
            Nova tarefa
          </button>

          <button
            type="button"
            className="project-header__danger-btn"
            onClick={onDeleteProject}
          >
            <Trash2 size={17} />
            Arquivar projeto
          </button>
        </div>
      </aside>
    </section>
  );
}

export default ProjectHeader;
import { useEffect, useState } from "react";
import {
  FolderKanban,
  Home,
  LayoutDashboard,
  LogOut,
  Plus,
  Settings,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import logoActrya from "../../assets/actrya-logo.png";
import { getProjects } from "../../services/projects";
import { removeAuthToken } from "../../services/auth";
import type { Project } from "../../types/project";
import "./Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>([]);

  async function loadProjects() {
    try {
      const data = await getProjects();
      setProjects(data.filter((project) => project.status !== "archived"));
    } catch (error) {
      console.error(error);
    }
  }

  function handleLogout() {
    removeAuthToken();
    navigate("/auth/login");
  }

  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <aside className="actrya-sidebar">
      <div className="actrya-sidebar__brand">
        <div className="actrya-sidebar__logo-wrap">
          <img
            src={logoActrya}
            alt="Logo Actrya"
            className="actrya-sidebar__logo"
          />
        </div>

        <div>
          <h1 className="actrya-sidebar__title">Actrya</h1>
          <p className="actrya-sidebar__subtitle">Project Control</p>
        </div>
      </div>

      <nav className="actrya-sidebar__nav">
        <Link
          to="/app"
          className="actrya-sidebar__nav-item actrya-sidebar__nav-item--active"
        >
          <Home size={17} />
          <span>Início</span>
        </Link>

        <button className="actrya-sidebar__nav-item" type="button">
          <LayoutDashboard size={17} />
          <span>Dashboard</span>
        </button>

        <button className="actrya-sidebar__nav-item" type="button">
          <Settings size={17} />
          <span>Configurações</span>
        </button>
      </nav>

      <div className="actrya-sidebar__projects">
        <div className="actrya-sidebar__projects-head">
          <p>Projetos</p>

          <button
            className="actrya-sidebar__add-btn"
            type="button"
            onClick={() => navigate("/app")}
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="actrya-sidebar__project-list">
          {projects.length === 0 && (
            <p className="actrya-sidebar__empty">Nenhum projeto ainda.</p>
          )}

          {projects.map((project) => (
            <Link
              key={project.id}
              to={`/app/projects/${project.id}`}
              className="actrya-sidebar__project-card"
            >
              <div className="actrya-sidebar__project-top">
                <div className="actrya-sidebar__project-icon">
                  <FolderKanban size={17} />
                </div>

                <div>
                  <p className="actrya-sidebar__project-name">
                    {project.name}
                  </p>
                  <span>{project.status}</span>
                </div>
              </div>

              <div className="actrya-sidebar__progress">
                <div style={{ width: "0%" }} />
              </div>
            </Link>
          ))}
        </div>
      </div>

      <button
        className="actrya-sidebar__logout"
        type="button"
        onClick={handleLogout}
      >
        <LogOut size={17} />
        <span>Sair</span>
      </button>
    </aside>
  );
}

export default Sidebar;
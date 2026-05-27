import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  FolderKanban,
  Plus,
  ShieldCheck,
  Target,
  Workflow,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import CreateProject from "../../components/projects/CreateProject";
import { getProjects } from "../../services/projects";
import { getTasksByProject } from "../../services/tasks";
import type { Project } from "../../types/project";
import type { Task } from "../../types/task";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  async function loadDashboard() {
    setIsLoadingDashboard(true);
    setErrorMessage("");

    try {
      const projectsData = await getProjects();

      const activeProjects = projectsData.filter(
        (project) => project.status !== "archived"
      );

      setProjects(activeProjects);

      const taskGroups = await Promise.all(
        activeProjects.map((project) => getTasksByProject(project.id))
      );

      setTasks(taskGroups.flat());
    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
      setErrorMessage(
        "Não foi possível carregar seus projetos agora. Tente atualizar a página."
      );
    } finally {
      setIsLoadingDashboard(false);
    }
  }

  const activeTasks = tasks.filter((task) => task.status !== "archived");
  const todoTasks = activeTasks.filter((task) => task.status === "todo");
  const doingTasks = activeTasks.filter((task) => task.status === "doing");
  const doneTasks = activeTasks.filter((task) => task.status === "done");

  const generalProgress = useMemo(() => {
    if (activeTasks.length === 0) return 0;
    return Math.round((doneTasks.length / activeTasks.length) * 100);
  }, [activeTasks.length, doneTasks.length]);

  const stats = [
    {
      label: "Projetos ativos",
      value: String(projects.length),
      icon: FolderKanban,
      description: "Espaços de trabalho em andamento.",
    },
    {
      label: "Tarefas pendentes",
      value: String(todoTasks.length + doingTasks.length),
      icon: Clock,
      description: "Itens que ainda precisam de ação.",
    },
    {
      label: "Tarefas concluídas",
      value: String(doneTasks.length),
      icon: CheckCircle2,
      description: "Entregas finalizadas nos seus projetos.",
    },
    {
      label: "Progresso geral",
      value: `${generalProgress}%`,
      icon: Target,
      description: "Percentual baseado nas tarefas concluídas.",
    },
  ];

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <AppLayout>
      <section className="home-hero">
        <div className="home-hero__main">
          <div className="home-hero__badge">Organize. Execute. Evolua.</div>

          <h1>Controle seus projetos como fluxos vivos de execução.</h1>

          <p>
            O Actrya transforma ideias, entregas e responsabilidades em projetos
            organizados por Kanban. Crie um projeto, divida em tarefas,
            acompanhe o andamento e veja o percentual de conclusão evoluir em
            tempo real.
          </p>

          <div className="home-hero__actions">
            <button
              className="home-btn home-btn--primary"
              type="button"
              onClick={() => setIsCreateProjectOpen(true)}
            >
              <Plus size={17} />
              Criar projeto
            </button>

            <button
              className="home-btn home-btn--secondary"
              type="button"
              onClick={() => {
                const section = document.getElementById("how-actrya-works");
                section?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Ver como funciona
              <ArrowRight size={17} />
            </button>
          </div>

          {errorMessage && <p className="home-error">{errorMessage}</p>}
        </div>

        <div className="home-hero__progress">
          <p>Progresso geral</p>

          <div className="home-hero__percentage">
            <strong>{generalProgress}</strong>
            <span>%</span>
          </div>

          <div className="home-progress">
            <div style={{ width: `${generalProgress}%` }} />
          </div>

          <small>
            O cálculo considera todas as tarefas ativas dos seus projetos:
            tarefas concluídas divididas pelo total de tarefas.
          </small>
        </div>
      </section>

      <section className="home-stats">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <article key={item.label} className="home-stat-card">
              <div>
                <Icon size={24} />
              </div>

              <p>{item.label}</p>
              <strong>{isLoadingDashboard ? "..." : item.value}</strong>
              <small>{item.description}</small>
            </article>
          );
        })}
      </section>

      <section className="home-how" id="how-actrya-works">
        <div className="home-how__head">
          <h2>Como o Actrya funciona</h2>
          <p>
            A lógica é simples: cada projeto vira um painel Kanban, e cada tarefa
            representa uma ação concreta para avançar.
          </p>
        </div>

        <div className="home-how__grid">
          <div className="home-how__card">
            <span>01</span>
            <Workflow size={24} />
            <h3>Crie um projeto</h3>
            <p>
              Use projetos para separar áreas, entregas, estudos, produtos ou
              qualquer iniciativa que precise de organização.
            </p>
          </div>

          <div className="home-how__card">
            <span>02</span>
            <FolderKanban size={24} />
            <h3>Monte seu Kanban</h3>
            <p>
              As tarefas são organizadas em A fazer, Fazendo e Concluído,
              criando uma visão clara do fluxo de trabalho.
            </p>
          </div>

          <div className="home-how__card">
            <span>03</span>
            <ShieldCheck size={24} />
            <h3>Acompanhe progresso</h3>
            <p>
              O percentual geral ajuda a entender o quanto já foi entregue e o
              que ainda precisa de foco.
            </p>
          </div>
        </div>
      </section>

      <section className="home-how">
        <div className="home-how__head">
          <h2>Seus projetos</h2>
          <p>
            Clique em um projeto para abrir o Kanban, criar tarefas e acompanhar
            o progresso individual.
          </p>
        </div>

        <div className="home-projects-grid">
          {isLoadingDashboard && (
            <div className="home-empty">
              <h3>Carregando seus projetos...</h3>
              <p>Buscando seus dados no Actrya.</p>
            </div>
          )}

          {!isLoadingDashboard && projects.length === 0 && (
            <div className="home-empty">
              <h3>Nenhum projeto criado ainda</h3>
              <p>
                Comece criando seu primeiro projeto. Depois você poderá adicionar
                tarefas e acompanhar o Kanban.
              </p>

              <button
                className="home-btn home-btn--primary"
                type="button"
                onClick={() => setIsCreateProjectOpen(true)}
              >
                <Plus size={17} />
                Criar primeiro projeto
              </button>
            </div>
          )}

          {!isLoadingDashboard &&
            projects.map((project) => (
              <button
                key={project.id}
                className="home-project-card"
                type="button"
                onClick={() => navigate(`/app/projects/${project.id}`)}
              >
                <span style={{ background: project.color || "#7C3AED" }} />

                <h3>{project.name}</h3>

                <p>{project.description || "Projeto sem descrição."}</p>

                <div className="home-project-card__footer">
                  <small>Status</small>
                  <strong>{project.status}</strong>
                </div>
              </button>
            ))}
        </div>
      </section>

      {isCreateProjectOpen && (
        <CreateProject
          onClose={() => {
            setIsCreateProjectOpen(false);
            setErrorMessage("");
          }}
          onCreated={async (project) => {
            setIsCreateProjectOpen(false);
            await loadDashboard();
            navigate(`/app/projects/${project.id}`);
          }}
        />
      )}
    </AppLayout>
  );
}

export default Home;
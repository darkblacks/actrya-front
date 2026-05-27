import { Bell, Search } from "lucide-react";
import "./Topbar.css";

function Topbar() {
  return (
    <header className="actrya-topbar">
      <div>
        <p className="actrya-topbar__eyebrow">Bem-vindo de volta</p>
        <h2 className="actrya-topbar__title">Painel Actrya</h2>
      </div>

      <div className="actrya-topbar__actions">
        <div className="actrya-topbar__search">
          <Search size={17} />
          <input placeholder="Buscar projetos ou tarefas..." />
        </div>

        <button className="actrya-topbar__icon-btn">
          <Bell size={20} />
        </button>

        <div className="actrya-topbar__avatar">D</div>
      </div>
    </header>
  );
}

export default Topbar;
import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "./AppLayout.css";

type AppLayoutProps = {
  children: ReactNode;
};

function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="actrya-layout">
      <Sidebar />

      <div className="actrya-layout__content">
        <Topbar />
        <main className="actrya-layout__main">{children}</main>
      </div>
    </div>
  );
}

export default AppLayout;
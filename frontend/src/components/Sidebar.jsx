import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        Project Manager
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/projects"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Projects
        </NavLink>

        <NavLink
          to="/tasks"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Tasks
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;
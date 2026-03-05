import {
  BarChart3,
  FolderKanban,
  ListTodo,
  Calendar,
  Clock,
  TrendingUp,
  Settings,
  LogOut,
  Users,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const Sidebar = ({ currentView, setCurrentView, user, onLogout }) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "projects", label: "Projects", icon: FolderKanban },
    { id: "work-items", label: "Work Items", icon: ListTodo },
    { id: "backlogs", label: "Backlogs", icon: Calendar },
    { id: "my-tasks", label: "My Tasks", icon: Clock },
  ];

  if (user?.role === "admin") {
    menuItems.push(
      { id: "team-members", label: "Team Members", icon: Users },
      { id: "settings", label: "Settings", icon: Settings },
      { id: "reports", label: "Reports", icon: TrendingUp },
    );
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <BarChart3 size={32} />
        <h2>DevTrack</h2>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.id}
              to={`/${item.id}`}
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">{user.name[0]}</div>
          <div className="user-details">
            <div className="user-name">{user.name}</div>
            <div className="user-role">{user.role}</div>
          </div>
        </div>
        <button className="logout-btn" onClick={onLogout}>
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

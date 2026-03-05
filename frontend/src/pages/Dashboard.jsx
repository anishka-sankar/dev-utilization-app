import { FolderKanban, ListTodo, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const Dashboard = ({ data, currentUser }) => {
  const { utilizationData, projectStatusData, workItems, projects } = data;
  const navigate = useNavigate();
  const statusDistribution = workItems.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.keys(statusDistribution).map((status) => ({
    name: status,
    value: statusDistribution[status],
  }));

  const COLORS = ["#10b981", "#f59e0b", "#3b82f6", "#ef4444", "#8b5cf6"];

  const projectProgress = projectStatusData.map((p) => ({
    name: p.name?.substring(0, 15) || "Unnamed",
    completion:
      p.completed_items && p.total_work_items
        ? Math.round((p.completed_items / p.total_work_items) * 100)
        : 0,
  }));

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Real-time overview of development activities</p>
      </div>

      <div className="stats-grid">
        <div
          className="stat-card"
          role="button"
          tabIndex={0}
          onClick={() => navigate("/projects")}
          onKeyDown={(e) =>
            (e.key === "Enter" || e.key === " ") && navigate("/projects")
          }
          aria-label="Go to Active Projects"
        >
          <div className="stat-icon" style={{ background: "#10b98115" }}>
            <FolderKanban style={{ color: "#10b981" }} />
          </div>
          <div className="stat-details">
            <div className="stat-value">{projects.length}</div>
            <div className="stat-label">Active Projects</div>
          </div>
        </div>
        <div
          className="stat-card"
          role="button"
          tabIndex={0}
          onClick={() => navigate("/work-items")}
          onKeyDown={(e) =>
            (e.key === "Enter" || e.key === " ") && navigate("/work-items")
          }
          aria-label="Go to Work Items"
        >
          <div className="stat-icon" style={{ background: "#3b82f615" }}>
            <ListTodo style={{ color: "#3b82f6" }} />
          </div>
          <div className="stat-details">
            <div className="stat-value">{workItems.length}</div>
            <div className="stat-label">Total Work Items</div>
          </div>
        </div>
        <div
          className="stat-card"
          role="button"
          tabIndex={0}
          onClick={() => navigate("/team-members")}
          onKeyDown={(e) =>
            (e.key === "Enter" || e.key === " ") && navigate("/team-members")
          }
          aria-label="Go to Team Members"
        >
          <div className="stat-icon" style={{ background: "#8b5cf615" }}>
            <Users style={{ color: "#8b5cf6" }} />
          </div>
          <div className="stat-details">
            <div className="stat-value">{utilizationData.length}</div>
            <div className="stat-label">Team Members</div>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Work Items Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Project Completion Progress</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={projectProgress}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="completion" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {currentUser?.role === "admin" && (
        <div className="chart-card full-width">
          <h3>Team Utilization Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={utilizationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="total_estimated_hours"
                fill="#3b82f6"
                name="Estimated Hours"
              />
              <Bar
                dataKey="total_actual_hours"
                fill="#10b981"
                name="Actual Hours"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

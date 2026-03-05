import { Download } from "lucide-react";

const Reports = ({ utilizationData, projectStatusData }) => {
  const exportToCSV = (data, filename) => {
    const csv = convertToCSV(data);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
  };

  const convertToCSV = (data) => {
    if (!data || data.length === 0) return "";
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map((row) => Object.values(row).join(",")).join("\n");
    return `${headers}\n${rows}`;
  };

  return (
    <div className="reports-view">
      <div className="page-header">
        <div>
          <h1>Reports</h1>
          <p>Export and analyze utilization data</p>
        </div>
        <div className="button-group">
          <button
            className="btn-primary"
            onClick={() => exportToCSV(utilizationData, "utilization-report")}
          >
            <Download size={18} />
            Export Utilization (CSV)
          </button>
          <button
            className="btn-primary"
            onClick={() =>
              exportToCSV(projectStatusData, "project-status-report")
            }
          >
            <Download size={18} />
            Export Projects (CSV)
          </button>
        </div>
      </div>

      <div className="report-section">
        <h2>Team Utilization Report</h2>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Total Tasks</th>
                <th>Estimated Hours</th>
                <th>Actual Hours</th>
                <th>Utilization %</th>
              </tr>
            </thead>
            <tbody>
              {utilizationData.map((user, idx) => (
                <tr key={idx}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.total_tasks || 0}</td>
                  <td>{user.total_estimated_hours || 0}</td>
                  <td>{user.total_actual_hours || 0}</td>
                  <td>
                    {user.total_estimated_hours > 0
                      ? Math.round(
                          (user.total_actual_hours /
                            user.total_estimated_hours) *
                            100,
                        )
                      : 0}
                    %
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="report-section">
        <h2>Project Status Report</h2>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Status</th>
                <th>Total Items</th>
                <th>Completed</th>
                <th>In Progress</th>
                <th>Completion %</th>
              </tr>
            </thead>
            <tbody>
              {projectStatusData.map((project) => (
                <tr key={project.id}>
                  <td>{project.name}</td>
                  <td>
                    <span className={`status-badge ${project.status}`}>
                      {project.status}
                    </span>
                  </td>
                  <td>{project.total_work_items || 0}</td>
                  <td>{project.completed_items || 0}</td>
                  <td>{project.in_progress_items || 0}</td>
                  <td>
                    {project.total_work_items > 0
                      ? Math.round(
                          (project.completed_items / project.total_work_items) *
                            100,
                        )
                      : 0}
                    %
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;

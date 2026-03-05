import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import api, { setAuthToken } from "./api";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Backlogs from "./pages/Backlogs";
import Dashboard from "./pages/Dashboard";
import LoginView from "./pages/LoginView";
import MyTasks from "./pages/MyTasks";
import Projects from "./pages/Projects";
import Reports from "./pages/Reports";
import SettingsView from "./pages/SettingsView";
import WorkItems from "./pages/WorkItems";
import TeamMembers from "./pages/TeamMembers";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [workItems, setWorkItems] = useState([]);
  const [backlogs, setBacklogs] = useState([]);
  const [utilizationData, setUtilizationData] = useState([]);
  const [projectStatusData, setProjectStatusData] = useState([]);
  const navigate = useNavigate();

  // Restore session on first load
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token && user) {
      setAuthToken(token);
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  // Load data when currentUser becomes available or changes
  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser]);

  const loadData = async () => {
    try {
      const user = currentUser;
      // Normalize role casing so "Admin"/"ADMIN"/"admin" all work
      const role = (user?.role || "").toLowerCase();
      const admin = role === "admin";
      console.log("Loading data for role:", role);

      const params = admin ? {} : { params: { scope: "mine" } };

      const [
        projectsRes,
        workItemsRes,
        backlogsRes,
        utilizationRes,
        projectStatusRes,
      ] = await Promise.all([
        api.get("/api/projects", params),
        api.get("/api/work-items", params),
        api.get("/api/backlogs", params),
        api.get("/api/reports/utilization", params),
        api.get("/api/reports/project-status", params),
      ]);

      setProjects(projectsRes.data);
      setWorkItems(workItemsRes.data);
      setBacklogs(backlogsRes.data);
      setUtilizationData(utilizationRes.data);
      setProjectStatusData(projectStatusRes.data);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleLogin = async (email, password) => {
    try {
      const response = await api.post(`/api/auth/login`, { email, password });

      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      setAuthToken(response.data.access_token);
      setCurrentUser(response.data.user);

      toast.success("Login successful!");

      // No need to call loadData() here; useEffect([currentUser]) will run it.
      navigate("/dashboard");
    } catch (error) {
      toast.error("Invalid credentials");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuthToken(null);
    setCurrentUser(null);
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="app-container">
      <Toaster position="top-right" />
      {currentUser && <Sidebar user={currentUser} onLogout={handleLogout} />}
      <main className="main-content">
        <Routes>
          <Route path="/login" element={<LoginView onLogin={handleLogin} />} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route
            path="/dashboard"
            element={
              <Dashboard
                data={{
                  utilizationData,
                  projectStatusData,
                  workItems,
                  projects,
                }}
                currentUser={currentUser}
              />
            }
          />
          <Route
            path="/projects"
            element={<Projects projects={projects} setProjects={setProjects} />}
          />
          <Route
            path="/work-items"
            element={
              <WorkItems
                workItems={workItems}
                setWorkItems={setWorkItems}
                projects={projects}
              />
            }
          />
          <Route
            path="/backlogs"
            element={
              <Backlogs
                backlogs={backlogs}
                setBacklogs={setBacklogs}
                projects={projects}
              />
            }
          />
          <Route
            path="/my-tasks"
            element={<MyTasks workItems={workItems} user={currentUser} />}
          />
          <Route
            path="/reports"
            element={
              (currentUser?.role || "").toLowerCase() === "admin" ? (
                <Reports
                  utilizationData={utilizationData}
                  projectStatusData={projectStatusData}
                />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />
          <Route
            path="/team-members"
            element={
              (currentUser?.role || "").toLowerCase() === "admin" ? (
                <TeamMembers
                  currentUser={currentUser}
                  utilizationData={utilizationData}
                />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />
          <Route
            path="/settings"
            element={
              (currentUser?.role || "").toLowerCase() === "admin" ? (
                <SettingsView onDataRefresh={loadData} />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />
        </Routes>
      </main>
    </div>
  );
};

export default App;

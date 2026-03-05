// src/pages/TeamMembers.jsx
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import api from "../api";

const TeamMembers = ({ currentUser }) => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const loadTeamMembers = async () => {
    try {
      const res = await api.get("/api/users"); // your team members API
      setTeamMembers(res.data);
    } catch (error) {
      toast.error("Failed to fetch team members");
      console.error(error);
    }
  };

  useEffect(() => {
    loadTeamMembers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/auth/register", formData); // registration API
      toast.success("Team member registered successfully!");
      setFormData({ name: "", email: "", password: "", role: "" });
      setShowForm(false);
      loadTeamMembers();
    } catch (error) {
      toast.error("Registration failed");
      console.error(error);
    }
  };

  return (
    <div className="main-content">
      {/* Page header */}
      <div className="page-header">
        <div>
          <h1>Team Members</h1>
          <p>Manage your workspace members and their roles</p>
        </div>

        <div className="button-group">
          <button
            className="btn-primary"
            onClick={() => setShowForm((prev) => !prev)}
          >
            {showForm ? "Cancel" : "Register Team Member"}
          </button>
        </div>
      </div>

      {/* Registration Form */}
      {showForm && (
        <div className="settings-card" style={{ marginBottom: 24 }}>
          <h2 style={{ marginBottom: 16 }}>Register New Member</h2>
          <form onSubmit={handleRegister}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="role">Role</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select role
                  </option>
                  <option value="Developer">Developer</option>
                  <option value="Manager">Manager</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Temporary Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Set a temporary password"
                  required
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Register
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Team Members Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: "35%" }}>Name</th>
              <th style={{ width: "45%" }}>Email</th>
              <th style={{ width: "20%" }}>Role</th>
            </tr>
          </thead>
          <tbody>
            {teamMembers.map((member) => (
              <tr key={member.email}>
                <td>{member.name}</td>
                <td>{member.email}</td>
                <td>
                  <span className="type-badge">{member.role}</span>
                </td>
              </tr>
            ))}
            {teamMembers.length === 0 && (
              <tr>
                <td colSpan={3}>
                  <div className="empty-state">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M4 7h16M4 12h16M4 17h16"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                    <p>
                      No members yet. Click “Register Team Member” to add one.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Keep Toaster mounted for feedback */}
      <Toaster position="top-right" />
    </div>
  );
};

export default TeamMembers;

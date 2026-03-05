import { format } from "date-fns";
import { Calendar, Edit, Plus, Save } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import api from "../api";
import Modal from "../components/modal";

const Projects = ({ projects, setProjects }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    status: "active",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProject) {
        await api.put(`/api/projects/${editingProject.id}`, formData);
        toast.success("Project updated successfully");
      } else {
        const response = await api.post(`/api/projects`, formData);
        setProjects([...projects, response.data]);
        toast.success("Project created successfully");
      }
      setShowModal(false);
      resetForm();
      const res = await api.get(`/api/projects`);
      setProjects(res.data);
    } catch (error) {
      toast.error("Failed to save project");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      start_date: "",
      end_date: "",
      status: "active",
    });
    setEditingProject(null);
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description || "",
      start_date: project.start_date || "",
      end_date: project.end_date || "",
      status: project.status,
    });
    setShowModal(true);
  };

  return (
    <div className="projects-view">
      <div className="page-header">
        <div>
          <h1>Projects</h1>
          <p>Manage your development projects</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={20} />
          New Project
        </button>
      </div>

      <div className="projects-grid">
        {projects.map((project) => (
          <div key={project.id} className="project-card">
            <div className="project-header">
              <h3>{project.name}</h3>
              <span className={`status-badge ${project.status}`}>
                {project.status}
              </span>
            </div>
            <p className="project-description">{project.description}</p>
            <div className="project-dates">
              <div>
                <Calendar size={16} />
                <span>
                  {project.start_date
                    ? format(new Date(project.start_date), "MMM dd, yyyy")
                    : "Not set"}
                </span>
              </div>
              <div>
                <Calendar size={16} />
                <span>
                  {project.end_date
                    ? format(new Date(project.end_date), "MMM dd, yyyy")
                    : "Not set"}
                </span>
              </div>
            </div>
            <div className="project-actions">
              <button className="btn-icon" onClick={() => handleEdit(project)}>
                <Edit size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <Modal
          onClose={() => {
            setShowModal(false);
            resetForm();
          }}
        >
          <h2>{editingProject ? "Edit Project" : "New Project"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Project Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) =>
                    setFormData({ ...formData, start_date: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) =>
                    setFormData({ ...formData, end_date: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option value="planning">Planning</option>
                <option value="active">Active</option>
                <option value="on-hold">On Hold</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                <Save size={18} />
                Save
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Projects;

import React, { useState } from "react";
import toast from "react-hot-toast";
import api from "../api";
import Modal from "../components/modal";
import { Plus, Edit, Trash2, Save } from "lucide-react";

const Backlogs = ({ backlogs, setBacklogs, projects }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingBacklog, setEditingBacklog] = useState(null);
  const [formData, setFormData] = useState({
    project_id: "",
    title: "",
    description: "",
    priority: 0,
    status: "new",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        project_id: parseInt(formData.project_id),
        priority: parseInt(formData.priority),
      };

      if (editingBacklog) {
        await api.put(`/api/backlogs/${editingBacklog.id}`, submitData);
        toast.success("Backlog updated");
      } else {
        await api.post(`/api/backlogs`, submitData);
        toast.success("Backlog created");
      }
      setShowModal(false);
      resetForm();
      const res = await api.get(`/api/backlogs`);
      setBacklogs(res.data);
    } catch (error) {
      toast.error("Failed to save backlog");
    }
  };

  const resetForm = () => {
    setFormData({
      project_id: "",
      title: "",
      description: "",
      priority: 0,
      status: "new",
    });
    setEditingBacklog(null);
  };

  const handleEdit = (backlog) => {
    setEditingBacklog(backlog);
    setFormData({
      project_id: backlog.project_id,
      title: backlog.title,
      description: backlog.description || "",
      priority: backlog.priority,
      status: backlog.status,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this backlog item?")) {
      try {
        await api.delete(`/api/backlogs/${id}`);
        setBacklogs(backlogs.filter((b) => b.id !== id));
        toast.success("Backlog deleted");
      } catch (error) {
        toast.error("Failed to delete backlog");
      }
    }
  };

  return (
    <div className="backlogs-view">
      <div className="page-header">
        <div>
          <h1>Backlogs</h1>
          <p>Manage product backlog items</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={20} />
          New Backlog Item
        </button>
      </div>

      <div className="backlogs-list">
        {backlogs
          .sort((a, b) => a.priority - b.priority)
          .map((backlog) => (
            <div key={backlog.id} className="backlog-card">
              <div className="backlog-header">
                <div>
                  <span className="priority-number">#{backlog.priority}</span>
                  <h3>{backlog.title}</h3>
                </div>
                <div className="backlog-meta">
                  <span className={`status-badge ${backlog.status}`}>
                    {backlog.status}
                  </span>
                  <span className="project-tag">
                    {projects.find((p) => p.id === backlog.project_id)?.name ||
                      "N/A"}
                  </span>
                </div>
              </div>
              {backlog.description && <p>{backlog.description}</p>}
              <div className="backlog-actions">
                <button
                  className="btn-icon"
                  onClick={() => handleEdit(backlog)}
                >
                  <Edit size={16} />
                </button>
                <button
                  className="btn-icon danger"
                  onClick={() => handleDelete(backlog.id)}
                >
                  <Trash2 size={16} />
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
          <h2>{editingBacklog ? "Edit Backlog Item" : "New Backlog Item"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Project</label>
              <select
                value={formData.project_id}
                onChange={(e) =>
                  setFormData({ ...formData, project_id: e.target.value })
                }
                required
              >
                <option value="">Select Project</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
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
                rows={4}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Priority</label>
                <input
                  type="number"
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value })
                  }
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <option value="new">New</option>
                  <option value="approved">Approved</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
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

export default Backlogs;

import React, { useState } from "react";
import Modal from "../components/modal";
import toast from "react-hot-toast";
import api from "../api";
import { Save, Plus, Edit, Trash2 } from "lucide-react";

const WorkItems = ({ workItems, setWorkItems, projects }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    project_id: "",
    title: "",
    description: "",
    type: "task",
    priority: "medium",
    status: "new",
    assigned_to: "",
    start_date: "",
    end_date: "",
    estimated_hours: "",
    t_shirt_size: "M",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        project_id: parseInt(formData.project_id),
        estimated_hours: formData.estimated_hours
          ? parseFloat(formData.estimated_hours)
          : null,
      };

      if (editingItem) {
        await api.put(`/api/work-items/${editingItem.id}`, submitData);
        toast.success("Work item updated");
      } else {
        await api.post(`/api/work-items`, submitData);
        toast.success("Work item created");
      }
      setShowModal(false);
      resetForm();
      const res = await api.get(`/api/work-items`);
      setWorkItems(res.data);
    } catch (error) {
      toast.error("Failed to save work item");
    }
  };

  const resetForm = () => {
    setFormData({
      project_id: "",
      title: "",
      description: "",
      type: "task",
      priority: "medium",
      status: "new",
      assigned_to: "",
      start_date: "",
      end_date: "",
      estimated_hours: "",
      t_shirt_size: "M",
    });
    setEditingItem(null);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      project_id: item.project_id,
      title: item.title,
      description: item.description || "",
      type: item.type,
      priority: item.priority,
      status: item.status,
      assigned_to: item.assigned_to || "",
      start_date: item.start_date || "",
      end_date: item.end_date || "",
      estimated_hours: item.estimated_hours || "",
      t_shirt_size: item.t_shirt_size || "M",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this work item?")) {
      try {
        await api.delete(`/api/work-items/${id}`);
        setWorkItems(workItems.filter((item) => item.id !== id));
        toast.success("Work item deleted");
      } catch (error) {
        toast.error("Failed to delete work item");
      }
    }
  };

  return (
    <div className="work-items-view">
      <div className="page-header">
        <div>
          <h1>Work Items</h1>
          <p>Manage tasks and features</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={20} />
          New Work Item
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Project</th>
              <th>Type</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Assigned To</th>
              <th>Estimated</th>
              <th>Actual</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {workItems.map((item) => (
              <tr key={item.id}>
                <td>{item.title}</td>
                <td>
                  {projects.find((p) => p.id === item.project_id)?.name ||
                    "N/A"}
                </td>
                <td>
                  <span className="type-badge">{item.type}</span>
                </td>
                <td>
                  <span className={`priority-badge ${item.priority}`}>
                    {item.priority}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${item.status}`}>
                    {item.status}
                  </span>
                </td>
                <td>{item.assigned_to || "Unassigned"}</td>
                <td>
                  {item.estimated_hours ? `${item.estimated_hours}h` : "-"}
                </td>
                <td>{item.actual_hours ? `${item.actual_hours}h` : "-"}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-icon"
                      onClick={() => handleEdit(item)}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="btn-icon danger"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal
          onClose={() => {
            setShowModal(false);
            resetForm();
          }}
        >
          <h2>{editingItem ? "Edit Work Item" : "New Work Item"}</h2>
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
                rows={3}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Type</label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                >
                  <option value="task">Task</option>
                  <option value="feature">Feature</option>
                  <option value="bug">Bug</option>
                  <option value="story">User Story</option>
                </select>
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value })
                  }
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <option value="new">New</option>
                  <option value="in-progress">In Progress</option>
                  <option value="testing">Testing</option>
                  <option value="completed">Completed</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>
              <div className="form-group">
                <label>T-Shirt Size</label>
                <select
                  value={formData.t_shirt_size}
                  onChange={(e) =>
                    setFormData({ ...formData, t_shirt_size: e.target.value })
                  }
                >
                  <option value="XS">XS</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Assigned To</label>
              <input
                type="email"
                value={formData.assigned_to}
                onChange={(e) =>
                  setFormData({ ...formData, assigned_to: e.target.value })
                }
                placeholder="user@example.com"
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
              <label>Estimated Hours</label>
              <input
                type="number"
                step="0.5"
                value={formData.estimated_hours}
                onChange={(e) =>
                  setFormData({ ...formData, estimated_hours: e.target.value })
                }
              />
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

export default WorkItems;

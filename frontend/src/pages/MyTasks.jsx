import { format } from "date-fns";
import { Clock, Plus, Save } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import api from "../api";
import Modal from "../components/modal";

const MyTasks = ({ workItems, user }) => {
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [progressData, setProgressData] = useState({
    hours_worked: "",
    progress_percentage: "",
    notes: "",
    date: format(new Date(), "yyyy-MM-dd"),
  });

  const myTasks = workItems.filter((item) => item.assigned_to === user.email);

  const handleAddProgress = (task) => {
    setSelectedTask(task);
    setShowProgressModal(true);
  };

  const handleSubmitProgress = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/api/task-progress`, {
        work_item_id: selectedTask.id,
        hours_worked: parseFloat(progressData.hours_worked),
        progress_percentage: parseFloat(progressData.progress_percentage),
        notes: progressData.notes,
        date: progressData.date,
      });
      toast.success("Progress logged successfully");
      setShowProgressModal(false);
      setProgressData({
        hours_worked: "",
        progress_percentage: "",
        notes: "",
        date: format(new Date(), "yyyy-MM-dd"),
      });
    } catch (error) {
      toast.error("Failed to log progress");
    }
  };

  return (
    <div className="my-tasks-view">
      <div className="page-header">
        <div>
          <h1>My Tasks</h1>
          <p>Track your progress and log hours</p>
        </div>
      </div>

      <div className="tasks-grid">
        {myTasks.map((task) => (
          <div key={task.id} className="task-card">
            <div className="task-header">
              <h3>{task.title}</h3>
              <span className={`status-badge ${task.status}`}>
                {task.status}
              </span>
            </div>
            <p className="task-description">{task.description}</p>
            <div className="task-metrics">
              <div className="metric">
                <span className="label">Estimated</span>
                <span className="value">{task.estimated_hours || 0}h</span>
              </div>
              <div className="metric">
                <span className="label">Actual</span>
                <span className="value">{task.actual_hours || 0}h</span>
              </div>
              <div className="metric">
                <span className="label">Size</span>
                <span className="value">{task.t_shirt_size || "M"}</span>
              </div>
            </div>
            <button
              className="btn-primary"
              onClick={() => handleAddProgress(task)}
            >
              <Plus size={18} />
              Log Progress
            </button>
          </div>
        ))}
        {myTasks.length === 0 && (
          <div className="empty-state">
            <Clock size={48} />
            <p>No tasks assigned to you yet</p>
          </div>
        )}
      </div>

      {showProgressModal && (
        <Modal onClose={() => setShowProgressModal(false)}>
          <h2>Log Progress: {selectedTask.title}</h2>
          <form onSubmit={handleSubmitProgress}>
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                value={progressData.date}
                onChange={(e) =>
                  setProgressData({ ...progressData, date: e.target.value })
                }
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Hours Worked</label>
                <input
                  type="number"
                  step="0.5"
                  value={progressData.hours_worked}
                  onChange={(e) =>
                    setProgressData({
                      ...progressData,
                      hours_worked: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Progress %</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={progressData.progress_percentage}
                  onChange={(e) =>
                    setProgressData({
                      ...progressData,
                      progress_percentage: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Notes</label>
              <textarea
                value={progressData.notes}
                onChange={(e) =>
                  setProgressData({ ...progressData, notes: e.target.value })
                }
                rows={4}
                placeholder="What did you accomplish today?"
              />
            </div>
            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowProgressModal(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                <Save size={18} />
                Save Progress
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default MyTasks;

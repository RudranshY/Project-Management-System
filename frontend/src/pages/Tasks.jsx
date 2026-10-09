import { useEffect, useState } from "react";
import axios from "axios";

import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";

const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  async function fetchTasks() {
    try {
      setLoading(true);
      setError("");

      const params = {};

      if (search.trim()) {
        params.search = search.trim();
      }

      if (status) {
        params.status = status;
      }

      if (priority) {
        params.priority = priority;
      }

      const response = await axios.get(
        `${API_URL}/tasks`,
        {
          ...authConfig,
          params,
        }
      );

      setTasks(response.data.tasks || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load tasks."
      );
    } finally {
      setLoading(false);
    }
  }

  async function fetchProjects() {
    try {
      const response = await axios.get(
        `${API_URL}/projects`,
        authConfig
      );

      setProjects(response.data.projects || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load projects."
      );
    }
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [search, status, priority]);

  function openCreateForm() {
    setEditingTask(null);
    setShowForm(true);
  }

  function handleEdit(task) {
    setEditingTask(task);
    setShowForm(true);
  }

  function handleCancel() {
    setShowForm(false);
    setEditingTask(null);
  }

  async function handleSubmit(formData) {
    try {
      setSaving(true);
      setError("");

      if (editingTask) {
        await axios.put(
          `${API_URL}/tasks/${editingTask.id}`,
          formData,
          authConfig
        );
      } else {
        await axios.post(
          `${API_URL}/tasks`,
          formData,
          authConfig
        );
      }

      setShowForm(false);
      setEditingTask(null);

      await fetchTasks();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to save task."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(taskId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await axios.delete(
        `${API_URL}/tasks/${taskId}`,
        authConfig
      );

      await fetchTasks();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to delete task."
      );
    }
  }

  async function handleComplete(task) {
    try {
      setError("");

      await axios.put(
        `${API_URL}/tasks/${task.id}`,
        {
          status: "Completed",
        },
        authConfig
      );

      await fetchTasks();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to complete task."
      );
    }
  }

  return (
    <div className="tasks-page">
      <div className="page-header tasks-header">
        <div>
          <p className="page-eyebrow">TASKS</p>

          <h1>Tasks</h1>

          <p>
            Manage and track your tasks.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={openCreateForm}
        >
          + New Task
        </button>
      </div>

      <div className="task-filters">
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value)
          }
        >
          <option value="">All Statuses</option>
          <option value="Pending">
            Pending
          </option>
          <option value="In Progress">
            In Progress
          </option>
          <option value="Completed">
            Completed
          </option>
        </select>

        <select
          value={priority}
          onChange={(e) =>
            setPriority(e.target.value)
          }
        >
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      {error && (
        <p className="form-error">
          {error}
        </p>
      )}

      {showForm && (
        <div className="form-container">
          <TaskForm
            task={editingTask}
            projects={projects}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={saving}
          />
        </div>
      )}

      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <h3>No tasks found</h3>
          <p>
            Create a task or change your search/filter.
          </p>
        </div>
      ) : (
        <div className="tasks-grid">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onComplete={handleComplete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Tasks;
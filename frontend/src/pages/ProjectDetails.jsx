import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import api from "../services/api";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";

function ProjectDetails() {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function fetchProject() {
    try {
      const response = await api.get(`/projects/${id}`);

      setProject(response.data.project);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load project."
      );
    }
  }

  async function fetchTasks() {
    try {
      const params = {
        project_id: id,
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      if (status) {
        params.status = status;
      }

      if (priority) {
        params.priority = priority;
      }

      const response = await api.get("/tasks", {
        params,
      });

      setTasks(response.data.tasks);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load tasks."
      );
    }
  }
async function loadPage() {
  try {
    setLoading(true);
    setError("");

    await fetchProject();
  } finally {
    setLoading(false);
  }
}

useEffect(() => {
  loadPage();
}, [id]);

useEffect(() => {
  const timer = setTimeout(() => {
    fetchTasks();
  }, 300);

  return () => {
    clearTimeout(timer);
  };
}, [id, search, status, priority]);

  function openCreateForm() {
    setEditingTask(null);
    setShowForm(true);
  }

  function openEditForm(task) {
    setEditingTask(task);
    setShowForm(true);
  }

  async function handleTaskSubmit(formData) {
    try {
      setSaving(true);
      setError("");

      if (editingTask) {
        await api.put(
          `/tasks/${editingTask.id}`,
          formData
        );
      } else {
        await api.post("/tasks", {
          project_id: Number(id),
          ...formData,
        });
      }

      setShowForm(false);
      setEditingTask(null);

      await fetchTasks();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to save task."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleComplete(task) {
    try {
      setError("");

      await api.put(`/tasks/${task.id}`, {
        name: task.name,
        description: task.description || "",
        priority: task.priority,
        status: "Completed",
        due_date: task.due_date || "",
      });

      await fetchTasks();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to complete task."
      );
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

      await api.delete(`/tasks/${taskId}`);

      await fetchTasks();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to delete task."
      );
    }
  }

  if (loading) {
    return <p>Loading project...</p>;
  }

  if (!project) {
    return (
      <div>
        <p>{error || "Project not found."}</p>
        <Link to="/projects">Back to Projects</Link>
      </div>
    );
  }

  return (
    <section>
      <div className="page-header project-details-header">
        <div>
          <Link to="/projects">← Back to Projects</Link>

          <h1>{project.name}</h1>

          <p>
            {project.description ||
              "No description provided."}
          </p>
        </div>

        <span className="project-status">
          {project.status}
        </span>
      </div>

      <div className="project-info">
        <span>
          Start: {project.start_date || "Not set"}
        </span>

        <span>
          End: {project.end_date || "Not set"}
        </span>
      </div>

      <div className="page-header tasks-header">
        <div>
          <h2>Tasks</h2>
          <p>Manage tasks for this project.</p>
        </div>

        <button onClick={openCreateForm}>
          New Task
        </button>
      </div>

      <div className="task-filters">
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />

        <select
          value={status}
          onChange={(event) =>
            setStatus(event.target.value)
          }
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <select
          value={priority}
          onChange={(event) =>
            setPriority(event.target.value)
          }
        >
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      {error && <p className="form-error">{error}</p>}

      {showForm && (
        <div className="form-container">
          <TaskForm
            task={editingTask}
            onSubmit={handleTaskSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingTask(null);
            }}
            loading={saving}
          />
        </div>
      )}

      {tasks.length === 0 ? (
        <div className="empty-state">
          <h3>No tasks found</h3>
          <p>
            Create a task or change your search and filters.
          </p>
        </div>
      ) : (
        <div className="tasks-grid">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={openEditForm}
              onDelete={handleDelete}
              onComplete={handleComplete}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default ProjectDetails;
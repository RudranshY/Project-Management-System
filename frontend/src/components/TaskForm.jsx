import { useEffect, useState } from "react";

const initialForm = {
  project_id: "",
  name: "",
  description: "",
  priority: "Medium",
  status: "Pending",
  due_date: "",
};

function TaskForm({
  task,
  projects,
  onSubmit,
  onCancel,
  loading,
}) {
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState("");

  useEffect(() => {
    if (task) {
      setFormData({
        project_id: task.project_id || "",
        name: task.name || "",
        description: task.description || "",
        priority: task.priority || "Medium",
        status: task.status || "Pending",
        due_date: task.due_date
          ? task.due_date.slice(0, 10)
          : "",
      });
    } else {
      setFormData({
        ...initialForm,
        project_id: projects?.[0]?.id || "",
      });
    }

    setError("");
  }, [task, projects]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!formData.project_id) {
      setError("Please select a project.");
      return;
    }

    if (!formData.name.trim()) {
      setError("Task name is required.");
      return;
    }

    if (formData.name.trim().length > 150) {
      setError("Task name must be 150 characters or less.");
      return;
    }

    onSubmit({
      ...formData,
      project_id: Number(formData.project_id),
      name: formData.name.trim(),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <h2>{task ? "Edit Task" : "Create Task"}</h2>

      <label>
        Project
        <select
          name="project_id"
          value={formData.project_id}
          onChange={handleChange}
        >
          <option value="">Select project</option>

          {projects?.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        Task Name
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter task name"
          maxLength={150}
        />
      </label>

      <label>
        Description
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the task"
          rows="4"
        />
      </label>

      <div className="form-row">
        <label>
          Priority
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </label>

        <label>
          Status
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </label>
      </div>

      <label>
        Due Date
        <input
          type="date"
          name="due_date"
          value={formData.due_date}
          onChange={handleChange}
        />
      </label>

      {error && (
        <p className="form-error">
          {error}
        </p>
      )}

      <div className="form-actions">
        <button
          type="submit"
          className="primary-button"
          disabled={loading}
        >
          {loading
            ? "Saving..."
            : task
            ? "Update Task"
            : "Create Task"}
        </button>

        <button
          type="button"
          className="secondary-button"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default TaskForm;
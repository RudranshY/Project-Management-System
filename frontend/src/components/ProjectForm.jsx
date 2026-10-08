import { useEffect, useState } from "react";

const initialForm = {
  name: "",
  description: "",
  status: "Not Started",
  start_date: "",
  end_date: "",
};

function ProjectForm({
  project,
  onSubmit,
  onCancel,
  loading,
}) {
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState("");

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || "",
        description: project.description || "",
        status: project.status || "Not Started",
        start_date: project.start_date
          ? project.start_date.slice(0, 10)
          : "",
        end_date: project.end_date
          ? project.end_date.slice(0, 10)
          : "",
      });
    } else {
      setFormData(initialForm);
    }

    setError("");
  }, [project]);

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

    if (!formData.name.trim()) {
      setError("Project name is required.");
      return;
    }

    if (formData.name.trim().length > 150) {
      setError(
        "Project name must be 150 characters or less."
      );
      return;
    }

    if (
      formData.start_date &&
      formData.end_date &&
      formData.end_date < formData.start_date
    ) {
      setError(
        "End date cannot be before start date."
      );
      return;
    }

    onSubmit({
      ...formData,
      name: formData.name.trim(),
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="project-form"
    >
      <h2>
        {project ? "Edit Project" : "Create Project"}
      </h2>

      <label>
        Project Name
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter project name"
          maxLength={150}
        />
      </label>

      <label>
        Description
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the project"
          rows="4"
        />
      </label>

      <label>
        Status
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="Not Started">
            Not Started
          </option>

          <option value="In Progress">
            In Progress
          </option>

          <option value="Completed">
            Completed
          </option>
        </select>
      </label>

      <label>
        Start Date
        <input
          type="date"
          name="start_date"
          value={formData.start_date}
          onChange={handleChange}
        />
      </label>

      <label>
        End Date
        <input
          type="date"
          name="end_date"
          value={formData.end_date}
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
            : project
            ? "Update Project"
            : "Create Project"}
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

export default ProjectForm;
import { useEffect, useState } from "react";

import api from "../services/api";
import ProjectCard from "../components/ProjectCard";
import ProjectForm from "../components/ProjectForm";

function Projects() {
  const [projects, setProjects] = useState([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function fetchProjects() {
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

      const response = await api.get("/projects", {
        params,
      });

      setProjects(response.data.projects);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load projects."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProjects();
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [search, status]);

  function openCreateForm() {
    setEditingProject(null);
    setShowForm(true);
  }

  function openEditForm(project) {
    setEditingProject(project);
    setShowForm(true);
  }

  async function handleSubmit(formData) {
    try {
      setSaving(true);
      setError("");

      if (editingProject) {
        await api.put(
          `/projects/${editingProject.id}`,
          formData
        );
      } else {
        await api.post("/projects", formData);
      }

      setShowForm(false);
      setEditingProject(null);

      await fetchProjects();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to save project."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(projectId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await api.delete(`/projects/${projectId}`);

      await fetchProjects();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to delete project."
      );
    }
  }

  return (
    <section>
      <div className="page-header projects-header">
        <div>
          <p className="page-eyebrow">WORKSPACE</p>

          <h1>Projects</h1>

          <p>
            Create, organize and track your projects.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={openCreateForm}
        >
          + New Project
        </button>
      </div>

      <div className="project-filters">
        <input
          type="text"
          placeholder="Search projects..."
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
      </div>

      {error && (
        <p className="form-error">
          {error}
        </p>
      )}

      {showForm && (
        <div className="form-container">
          <ProjectForm
            project={editingProject}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingProject(null);
            }}
            loading={saving}
          />
        </div>
      )}

      {loading ? (
        <p>Loading projects...</p>
      ) : projects.length === 0 ? (
        <div className="empty-state">
          <h3>No projects found</h3>
          <p>
            Create a project or change your search/filter.
          </p>
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={openEditForm}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default Projects;
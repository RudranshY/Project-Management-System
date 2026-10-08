import { Link } from "react-router-dom";
import { formatDate } from "../utils/formatDate";

function ProjectCard({ project, onEdit, onDelete }) {
  return (
    <article className="project-card">
      <div className="project-card-header">
        <h3>{project.name}</h3>

        <span
          className={`status-badge status-${project.status
            .toLowerCase()
            .replace(/\s+/g, "-")}`}
        >
          {project.status}
        </span>
      </div>

      <p className="project-description">
        {project.description || "No description provided."}
      </p>

      <div className="project-dates">
        <span>
          Start: {formatDate(project.start_date)}
        </span>

        <span>
          End: {formatDate(project.end_date)}
        </span>
      </div>

      <div className="project-actions">
        <Link
          className="text-button"
          to={`/projects/${project.id}`}
        >
          View
        </Link>

        <button
          className="secondary-button"
          onClick={() => onEdit(project)}
        >
          Edit
        </button>

        <button
          className="danger-button"
          onClick={() => onDelete(project.id)}
        >
          Delete
        </button>
      </div>
    </article>
  );
}

export default ProjectCard;
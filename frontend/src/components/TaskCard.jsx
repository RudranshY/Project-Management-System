import { formatDate } from "../utils/formatDate";

function TaskCard({
  task,
  onEdit,
  onDelete,
  onComplete,
}) {
  return (
    <article className="task-card">
      <div className="task-card-header">
        <h3>{task.name}</h3>

        <span
          className={`status-badge status-${task.status
            .toLowerCase()
            .replace(/\s+/g, "-")}`}
        >
          {task.status}
        </span>
      </div>

      {task.project_name && (
        <p className="task-project">
          Project: {task.project_name}
        </p>
      )}

      <p className="task-description">
        {task.description || "No description provided."}
      </p>

      <div className="task-meta">
        <span
          className={`priority-badge priority-${task.priority.toLowerCase()}`}
        >
          {task.priority} Priority
        </span>

        <span>
          Due: {formatDate(task.due_date)}
        </span>
      </div>

      <div className="task-actions">
        {task.status !== "Completed" && (
          <button
            className="primary-button"
            onClick={() => onComplete(task)}
          >
            Mark Complete
          </button>
        )}

        <button
          className="secondary-button"
          onClick={() => onEdit(task)}
        >
          Edit
        </button>

        <button
          className="danger-button"
          onClick={() => onDelete(task.id)}
        >
          Delete
        </button>
      </div>
    </article>
  );
}

export default TaskCard;
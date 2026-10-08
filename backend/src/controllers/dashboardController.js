const pool = require("../config/db");

async function getDashboard(req, res) {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      `SELECT
        (SELECT COUNT(*)
         FROM projects
         WHERE user_id = $1) AS total_projects,

        (SELECT COUNT(*)
         FROM tasks t
         INNER JOIN projects p
           ON p.id = t.project_id
         WHERE p.user_id = $1) AS total_tasks,

        (SELECT COUNT(*)
         FROM tasks t
         INNER JOIN projects p
           ON p.id = t.project_id
         WHERE p.user_id = $1
           AND t.status = 'Completed') AS completed_tasks,

        (SELECT COUNT(*)
         FROM tasks t
         INNER JOIN projects p
           ON p.id = t.project_id
         WHERE p.user_id = $1
           AND t.status = 'Pending') AS pending_tasks,

        (SELECT COUNT(*)
         FROM projects
         WHERE user_id = $1
           AND status = 'In Progress') AS projects_in_progress`,
      [userId]
    );

    const dashboard = result.rows[0];

    return res.status(200).json({
      total_projects: Number(dashboard.total_projects),
      total_tasks: Number(dashboard.total_tasks),
      completed_tasks: Number(dashboard.completed_tasks),
      pending_tasks: Number(dashboard.pending_tasks),
      projects_in_progress: Number(dashboard.projects_in_progress)
    });
  } catch (error) {
    console.error("Get dashboard error:", error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
}

module.exports = {
  getDashboard
};
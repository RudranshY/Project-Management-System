const pool = require("../config/db");

async function createTask(req, res) {
  try {
    const {
      project_id,
      name,
      description,
      priority,
      status,
      due_date
    } = req.body;

    const project = await pool.query(
      `SELECT id
       FROM projects
       WHERE id = $1 AND user_id = $2`,
      [project_id, req.user.userId]
    );

    if (project.rows.length === 0) {
      return res.status(404).json({
        message: "Project not found"
      });
    }

    const result = await pool.query(
      `INSERT INTO tasks
       (project_id, name, description, priority, status, due_date)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, project_id, name, description, priority, status, due_date, created_at`,
      [
        project_id,
        name.trim(),
        description?.trim() || null,
        priority || "Medium",
        status || "Pending",
        due_date || null
      ]
    );

    return res.status(201).json({
      message: "Task created successfully",
      task: result.rows[0]
    });
  } catch (error) {
    console.error("Create task error:", error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
}
async function getTasks(req, res) {
  try {
    const {
      search,
      status,
      priority,
      project_id
    } = req.query;

    const values = [req.user.userId];
    const conditions = ["p.user_id = $1"];

    if (search) {
      values.push(`%${search.trim()}%`);
      conditions.push(`t.name ILIKE $${values.length}`);
    }

    if (status) {
      values.push(status);
      conditions.push(`t.status = $${values.length}`);
    }

    if (priority) {
      values.push(priority);
      conditions.push(`t.priority = $${values.length}`);
    }

    if (project_id) {
      values.push(project_id);
      conditions.push(`t.project_id = $${values.length}`);
    }

    const query = `
      SELECT
        t.id,
        t.project_id,
        p.name AS project_name,
        t.name,
        t.description,
        t.priority,
        t.status,
        t.due_date,
        t.created_at
      FROM tasks t
      INNER JOIN projects p
        ON p.id = t.project_id
      WHERE ${conditions.join(" AND ")}
      ORDER BY t.created_at DESC
    `;

    const result = await pool.query(query, values);

    return res.status(200).json({
      tasks: result.rows
    });
  } catch (error) {
    console.error("Get tasks error:", error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
}
async function getTaskById(req, res) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT
         t.id,
         t.project_id,
         p.name AS project_name,
         t.name,
         t.description,
         t.priority,
         t.status,
         t.due_date,
         t.created_at
       FROM tasks t
       INNER JOIN projects p
         ON p.id = t.project_id
       WHERE t.id = $1
         AND p.user_id = $2`,
      [id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    return res.status(200).json({
      task: result.rows[0]
    });
  } catch (error) {
    console.error("Get task error:", error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
}
async function updateTask(req, res) {
  try {
    const { id } = req.params;

    const {
      name,
      description,
      priority,
      status,
      due_date
    } = req.body;

    const result = await pool.query(
      `UPDATE tasks t
       SET name = $1,
           description = $2,
           priority = $3,
           status = $4,
           due_date = $5
       FROM projects p
       WHERE t.project_id = p.id
         AND t.id = $6
         AND p.user_id = $7
       RETURNING
         t.id,
         t.project_id,
         t.name,
         t.description,
         t.priority,
         t.status,
         t.due_date,
         t.created_at`,
      [
        name.trim(),
        description?.trim() || null,
        priority,
        status,
        due_date || null,
        id,
        req.user.userId
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    return res.status(200).json({
      message: "Task updated successfully",
      task: result.rows[0]
    });
  } catch (error) {
    console.error("Update task error:", error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
}
async function deleteTask(req, res) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM tasks t
       USING projects p
       WHERE t.project_id = p.id
         AND t.id = $1
         AND p.user_id = $2
       RETURNING t.id`,
      [id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    return res.status(200).json({
      message: "Task deleted successfully"
    });
  } catch (error) {
    console.error("Delete task error:", error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
}
module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
};
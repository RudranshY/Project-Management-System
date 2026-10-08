const pool = require("../config/db");

async function createProject(req, res) {
  try {
    const {
      name,
      description,
      status,
      start_date,
      end_date
    } = req.body;

    const result = await pool.query(
      `INSERT INTO projects
       (user_id, name, description, status, start_date, end_date)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, name, description, status, start_date, end_date, created_at`,
      [
        req.user.userId,
        name.trim(),
        description?.trim() || null,
        status || "Not Started",
        start_date || null,
        end_date || null
      ]
    );

    return res.status(201).json({
      message: "Project created successfully",
      project: result.rows[0]
    });
  } catch (error) {
    console.error("Create project error:", error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
}
async function getProjects(req, res) {
  try {
    const { search, status } = req.query;

    const values = [req.user.userId];
    const conditions = ["user_id = $1"];

    if (search) {
      values.push(`%${search.trim()}%`);
      conditions.push(`name ILIKE $${values.length}`);
    }

    if (status) {
      values.push(status);
      conditions.push(`status = $${values.length}`);
    }

    const query = `
      SELECT id, name, description, status, start_date, end_date, created_at
      FROM projects
      WHERE ${conditions.join(" AND ")}
      ORDER BY created_at DESC
    `;

    const result = await pool.query(query, values);

    return res.status(200).json({
      projects: result.rows
    });
  } catch (error) {
    console.error("Get projects error:", error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
}
async function getProjectById(req, res) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT id, name, description, status, start_date, end_date, created_at
       FROM projects
       WHERE id = $1 AND user_id = $2`,
      [id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Project not found"
      });
    }

    return res.status(200).json({
      project: result.rows[0]
    });
  } catch (error) {
    console.error("Get project error:", error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
}
async function updateProject(req, res) {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      status,
      start_date,
      end_date
    } = req.body;

    const result = await pool.query(
      `UPDATE projects
       SET name = $1,
           description = $2,
           status = $3,
           start_date = $4,
           end_date = $5
       WHERE id = $6 AND user_id = $7
       RETURNING id, name, description, status, start_date, end_date, created_at`,
      [
        name.trim(),
        description?.trim() || null,
        status,
        start_date || null,
        end_date || null,
        id,
        req.user.userId
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Project not found"
      });
    }

    return res.status(200).json({
      message: "Project updated successfully",
      project: result.rows[0]
    });
  } catch (error) {
    console.error("Update project error:", error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
}
async function deleteProject(req, res) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM projects
       WHERE id = $1 AND user_id = $2
       RETURNING id`,
      [id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Project not found"
      });
    }

    return res.status(200).json({
      message: "Project deleted successfully"
    });
  } catch (error) {
    console.error("Delete project error:", error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
}

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject
};
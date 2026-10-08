const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function register(req, res) {
  try {
    const { full_name, email, password } = req.body;

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [normalizedEmail]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        message: "Email address is already registered"
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const result = await pool.query(
      `INSERT INTO users (full_name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, full_name, email, created_at`,
      [full_name.trim(), normalizedEmail, passwordHash]
    );

    return res.status(201).json({
      message: "Registration successful",
      user: result.rows[0]
    });
  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const normalizedEmail = email.trim().toLowerCase();

    const result = await pool.query(
      `SELECT id, full_name, email, password_hash
       FROM users
       WHERE email = $1`,
      [normalizedEmail]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const user = result.rows[0];

    const passwordMatches = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      {
        userId: user.id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1h"
      }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
}
async function getMe(req, res) {
  try {
    const result = await pool.query(
      `SELECT id, full_name, email, created_at
       FROM users
       WHERE id = $1`,
      [req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    return res.status(200).json({
      user: result.rows[0]
    });
  } catch (error) {
    console.error("Get current user error:", error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
}
async function getMe(req, res) {
  try {
    const result = await pool.query(
      `SELECT id, full_name, email, created_at
       FROM users
       WHERE id = $1`,
      [req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    return res.status(200).json({
      user: result.rows[0]
    });
  } catch (error) {
    console.error("Get current user error:", error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
}

module.exports = {
  register,
  login,
  getMe
};
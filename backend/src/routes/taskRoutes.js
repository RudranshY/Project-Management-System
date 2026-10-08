const express = require("express");
const {
  body,
  param,
} = require("express-validator");

const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

const authenticateToken = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validationMiddleware");

const router = express.Router();

const taskValidation = [
  body("project_id")
    .isInt({ min: 1 })
    .withMessage("Valid project ID is required"),

  body("name")
    .trim()
    .notEmpty()
    .withMessage("Task name is required"),

  body("description")
    .optional()
    .trim(),

  body("priority")
    .optional()
    .isIn(["Low", "Medium", "High"])
    .withMessage("Invalid task priority"),

  body("status")
    .optional()
    .isIn(["Pending", "In Progress", "Completed"])
    .withMessage("Invalid task status"),

  body("due_date")
    .optional()
    .isISO8601()
    .withMessage("Invalid due date"),
];

// Validation for task IDs
const taskIdValidation = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("Task ID must be a positive integer"),
];

router.get(
  "/:id",
  authenticateToken,
  taskIdValidation,
  validateRequest,
  getTaskById
);

router.put(
  "/:id",
  authenticateToken,
  taskIdValidation,
  taskValidation,
  validateRequest,
  updateTask
);

router.delete(
  "/:id",
  authenticateToken,
  taskIdValidation,
  validateRequest,
  deleteTask
);

router.post(
  "/",
  authenticateToken,
  taskValidation,
  validateRequest,
  createTask
);

router.get(
  "/",
  authenticateToken,
  getTasks
);

module.exports = router;
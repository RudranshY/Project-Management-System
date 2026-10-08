const express = require("express");
const {
  body,
  param,
} = require("express-validator");

const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

const authenticateToken = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validationMiddleware");

const router = express.Router();

const projectValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Project name is required"),

  body("description")
    .optional()
    .trim(),

  body("status")
    .optional()
    .isIn(["Not Started", "In Progress", "Completed"])
    .withMessage("Invalid project status"),

  body("start_date")
    .optional()
    .isISO8601()
    .withMessage("Invalid start date"),

  body("end_date")
    .optional()
    .isISO8601()
    .withMessage("Invalid end date"),
];

// Validation for project ID in /:id routes
const projectIdValidation = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("Project ID must be a positive integer"),
];

router.post(
  "/",
  authenticateToken,
  projectValidation,
  validateRequest,
  createProject
);

router.get(
  "/",
  authenticateToken,
  getProjects
);

router.get(
  "/:id",
  authenticateToken,
  projectIdValidation,
  validateRequest,
  getProjectById
);

router.put(
  "/:id",
  authenticateToken,
  projectIdValidation,
  projectValidation,
  validateRequest,
  updateProject
);

router.delete(
  "/:id",
  authenticateToken,
  projectIdValidation,
  validateRequest,
  deleteProject
);

module.exports = router;
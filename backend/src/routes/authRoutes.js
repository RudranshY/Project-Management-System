const express = require("express");
const { body } = require("express-validator");

const {
  register,
  login,
  getMe
} = require("../controllers/authController");

const validateRequest = require("../middleware/validationMiddleware");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

const registerValidation = [
  body("full_name")
    .trim()
    .notEmpty()
    .withMessage("Full name is required"),

  body("email")
    .trim()
    .isEmail()
    .withMessage("A valid email address is required"),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
];

const loginValidation = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("A valid email address is required"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
];

router.post(
  "/register",
  registerValidation,
  validateRequest,
  register
);

router.post(
  "/login",
  loginValidation,
  validateRequest,
  login
);

router.get(
  "/me",
  authenticateToken,
  getMe
);

router.post("/logout", (req, res) => {
  return res.status(200).json({
    message: "Logout successful"
  });
});

module.exports = router;
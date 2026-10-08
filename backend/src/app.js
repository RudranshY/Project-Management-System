const authRoutes = require("./routes/authRoutes");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
dotenv.config();

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);
app.use(express.json());
app.use(morgan("dev"));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    message: "Too many authentication attempts. Please try again later."
  }
});

app.use("/api/auth", authLimiter);
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend is running"
  });
});

module.exports = app;
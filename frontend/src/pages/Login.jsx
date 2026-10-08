import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getApiErrorMessage } from "../utils/apiError";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  useEffect(() => {
    const message = sessionStorage.getItem("authMessage");

    if (message) {
      setError(message);
      sessionStorage.removeItem("authMessage");
    }
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (!formData.email || !formData.password) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);

      await login(formData);

      navigate("/dashboard");
    } catch (error) {
      setError(
        getApiErrorMessage(error, "Unable to log in.")
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <p className="auth-brand">
            PROJECT MANAGER
          </p>

          <h1>Welcome back</h1>

          <p className="auth-subtitle">
            Sign in to manage your projects and tasks.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="auth-form"
        >
          <div>
            <label>Email</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Password</label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {error && (
            <p className="auth-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p>
          Don't have an account?{" "}
          <Link to="/register">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
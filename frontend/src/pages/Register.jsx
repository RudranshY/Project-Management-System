import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getApiErrorMessage } from "../utils/apiError";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    full_name: "",
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

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (
      !formData.full_name ||
      !formData.email ||
      !formData.password
    ) {
      setError("All fields are required.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    try {
      setLoading(true);

      await register(formData);

      navigate("/login");
    } catch (error) {
      setError(
        getApiErrorMessage(error, "Unable to register.")
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Create Account</h1>

        <form onSubmit={handleSubmit} className="auth-form">
          <div>
            <label>Full Name</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
            />
          </div>

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

          <button type="submit" disabled={loading}>
            {loading
              ? "Creating account..."
              : "Register"}
          </button>
        </form>

        <p>
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
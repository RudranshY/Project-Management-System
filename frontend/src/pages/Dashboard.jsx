import { useEffect, useState } from "react";

import api from "../services/api";
import StatCard from "../components/StatCard";

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchDashboard() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/dashboard");

      setDashboard(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>

        <button
          className="primary-button"
          onClick={fetchDashboard}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <section>
      <div className="page-header dashboard-header">
        <div>
          <p className="page-eyebrow">OVERVIEW</p>

          <h1>Dashboard</h1>

          <p>
            A quick look at your projects and tasks.
          </p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Total Projects"
          value={dashboard.total_projects}
        />

        <StatCard
          title="Total Tasks"
          value={dashboard.total_tasks}
        />

        <StatCard
          title="Completed Tasks"
          value={dashboard.completed_tasks}
        />

        <StatCard
          title="Pending Tasks"
          value={dashboard.pending_tasks}
        />

        <StatCard
          title="Projects In Progress"
          value={dashboard.projects_in_progress}
        />
      </div>

      <div className="dashboard-summary">
        <div>
          <h3>Stay on top of your work</h3>

          <p>
            Review your pending tasks and project progress
            from one place.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
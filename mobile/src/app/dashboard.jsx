import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Redirect, useRouter } from "expo-router";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function DashboardScreen() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  async function fetchDashboard() {
    try {
      setError("");

      const response = await api.get("/dashboard");

      setDashboard(response.data);
    } catch (error) {
      if (error.code === "ERR_NETWORK") {
        setError(
          "Unable to connect to the server. Check your network connection."
        );
      } else {
        setError(
          error.response?.data?.message ||
            "Unable to load dashboard."
        );
      }
    }
  }

  async function loadDashboard() {
    try {
      setLoading(true);
      await fetchDashboard();
    } finally {
      setLoading(false);
    }
  }

  async function handleRefresh() {
    try {
      setRefreshing(true);
      await fetchDashboard();
    } finally {
      setRefreshing(false);
    }
  }

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  useEffect(() => {
    if (user) {
      loadDashboard();
    }
  }, [user]);

  if (authLoading || loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      }
    >
      <Text style={styles.heading}>
        Welcome, {user.full_name}
      </Text>

      <Text style={styles.email}>{user.email}</Text>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>

          <Pressable
            style={styles.retryButton}
            onPress={fetchDashboard}
          >
            <Text style={styles.retryText}>
              Try Again
            </Text>
          </Pressable>
        </View>
      ) : null}

      {dashboard && (
        <View style={styles.grid}>
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
        </View>
      )}
      <Pressable
  style={styles.logoutButton}
  onPress={() => router.push("/projects")}
>
  <Text style={styles.logoutText}>
    View Projects
  </Text>
</Pressable>

      <Pressable
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </ScrollView>
  );
}

function StatCard({ title, value }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f5f6f8",
    flexGrow: 1,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  heading: {
    fontSize: 24,
    fontWeight: "700",
  },

  email: {
    color: "#666",
    marginTop: 4,
    marginBottom: 24,
  },

  grid: {
    gap: 12,
  },

  card: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 18,
  },

  cardTitle: {
    color: "#666",
    marginBottom: 8,
  },

  cardValue: {
    fontSize: 28,
    fontWeight: "700",
  },

  errorBox: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#fecaca",
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
  },

  errorText: {
    color: "#b91c1c",
    marginBottom: 10,
  },

  retryButton: {
    alignSelf: "flex-start",
    backgroundColor: "#222",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },

  retryText: {
    color: "#fff",
  },

  logoutButton: {
    backgroundColor: "#222",
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
  },

  logoutText: {
    color: "#fff",
    fontWeight: "600",
  },
});
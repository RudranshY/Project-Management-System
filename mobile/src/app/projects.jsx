import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  FlatList,
} from "react-native";

import { useRouter } from "expo-router";

import api from "../services/api";

export default function ProjectsScreen() {
  const router = useRouter();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  async function fetchProjects() {
    try {
      setError("");

      const response = await api.get("/projects");

      setProjects(response.data.projects);
    } catch (error) {
      if (error.code === "ERR_NETWORK") {
        setError(
          "Unable to connect to the server. Check your network connection."
        );
      } else {
        setError(
          error.response?.data?.message ||
            "Unable to load projects."
        );
      }
    }
  }

  async function loadProjects() {
    try {
      setLoading(true);
      await fetchProjects();
    } finally {
      setLoading(false);
    }
  }

  async function handleRefresh() {
    try {
      setRefreshing(true);
      await fetchProjects();
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error && projects.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>

        <Pressable
          style={styles.button}
          onPress={loadProjects}
        >
          <Text style={styles.buttonText}>
            Try Again
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Projects</Text>

      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : null}

      <FlatList
        data={projects}
        keyExtractor={(item) => String(item.id)}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        contentContainerStyle={
          projects.length === 0
            ? styles.emptyList
            : undefined
        }
        renderItem={({ item }) => (
          <Pressable
            style={styles.projectCard}
            onPress={() =>
              router.push(`/projects/${item.id}`)
            }
          >
            <View style={styles.cardHeader}>
              <Text style={styles.projectName}>
                {item.name}
              </Text>

              <Text style={styles.status}>
                {item.status}
              </Text>
            </View>

            <Text style={styles.description}>
              {item.description ||
                "No description provided."}
            </Text>

            <Text style={styles.date}>
              End: {item.end_date || "Not set"}
            </Text>
          </Pressable>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No projects found.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f6f8",
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  heading: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 18,
  },

  projectCard: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
  },

  projectName: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
  },

  status: {
    fontSize: 12,
    color: "#555",
  },

  description: {
    color: "#666",
    marginTop: 8,
    marginBottom: 10,
  },

  date: {
    fontSize: 13,
    color: "#777",
  },

  error: {
    color: "#b91c1c",
    marginBottom: 12,
    textAlign: "center",
  },

  button: {
    backgroundColor: "#222",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 7,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },

  emptyList: {
    flexGrow: 1,
    justifyContent: "center",
  },

  emptyText: {
    textAlign: "center",
    color: "#666",
  },
});
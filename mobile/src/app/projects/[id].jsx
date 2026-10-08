import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useLocalSearchParams, useRouter } from "expo-router";

import api from "../../services/api";

export default function ProjectDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchProject() {
    try {
      setError("");

      const response = await api.get(
        `/projects/${id}`
      );

      setProject(response.data.project);
    } catch (error) {
      if (error.code === "ERR_NETWORK") {
        setError(
          "Unable to connect to the server."
        );
      } else {
        setError(
          error.response?.data?.message ||
            "Unable to load project."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!project) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>
          {error || "Project not found."}
        </Text>

        <Pressable
          style={styles.button}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>
            Go Back
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
    >
      <Text style={styles.title}>
        {project.name}
      </Text>

      <Text style={styles.status}>
        {project.status}
      </Text>

      <Text style={styles.description}>
        {project.description ||
          "No description provided."}
      </Text>

      <View style={styles.infoBox}>
        <Text>
          Start: {project.start_date || "Not set"}
        </Text>

        <Text>
          End: {project.end_date || "Not set"}
        </Text>
      </View>

      <Pressable
        style={styles.button}
        onPress={() =>
          router.push(`/projects/${id}/tasks`)
        }
      >
        <Text style={styles.buttonText}>
          View Tasks
        </Text>
      </Pressable>
    </ScrollView>
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
    padding: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
  },

  status: {
    marginTop: 8,
    color: "#555",
  },

  description: {
    marginTop: 18,
    color: "#666",
    lineHeight: 22,
  },

  infoBox: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 16,
    gap: 8,
    marginVertical: 20,
  },

  button: {
    backgroundColor: "#222",
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },

  error: {
    color: "#b91c1c",
    textAlign: "center",
    marginBottom: 14,
  },
});
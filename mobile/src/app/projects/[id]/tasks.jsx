import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useLocalSearchParams } from "expo-router";

import api from "../../../services/api";
import TaskCard from "../../../components/TaskCard";
import TaskForm from "../../../components/TaskForm";

export default function TasksScreen() {
  const { id } = useLocalSearchParams();

  const [tasks, setTasks] = useState([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  async function fetchTasks() {
    try {
      setError("");

      const params = {
        project_id: id,
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      if (status) {
        params.status = status;
      }

      if (priority) {
        params.priority = priority;
      }

      const response = await api.get("/tasks", {
        params,
      });

      setTasks(response.data.tasks);
    } catch (error) {
      if (error.code === "ERR_NETWORK") {
        setError(
          "Unable to connect to the server."
        );
      } else {
        setError(
          error.response?.data?.message ||
            "Unable to load tasks."
        );
      }
    }
  }

  async function loadTasks() {
    try {
      setLoading(true);
      await fetchTasks();
    } finally {
      setLoading(false);
    }
  }

  async function handleRefresh() {
    try {
      setRefreshing(true);
      await fetchTasks();
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, [id]);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        fetchTasks();
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [search, status, priority]);

  function openCreateForm() {
    setEditingTask(null);
    setShowForm(true);
  }

  function openEditForm(task) {
    setEditingTask(task);
    setShowForm(true);
  }

  async function handleSubmit(formData) {
    try {
      setSaving(true);
      setError("");

   if (editingTask) {
  await api.put(`/tasks/${editingTask.id}`, {
    ...formData,
    project_id: Number(id),
    due_date: formData.due_date
      ? formData.due_date.slice(0, 10)
      : "",
  });
}else {
        await api.post("/tasks", {
          project_id: Number(id),
          ...formData,
        });
      }

      setShowForm(false);
      setEditingTask(null);

      await fetchTasks();
    } catch (error) {
      if (error.code === "ERR_NETWORK") {
        setError(
          "Unable to connect to the server."
        );
      } else {
        setError(
          error.response?.data?.message ||
            "Unable to save task."
        );
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleComplete(task) {
    try {
      setError("");

    await api.put(`/tasks/${task.id}`, {
  project_id: Number(id),
  name: task.name,
  description: task.description || "",
  priority: task.priority,
  status: "Completed",
  due_date: task.due_date
    ? String(task.due_date).slice(0, 10)
    : "",
});

      await fetchTasks();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to complete task."
      );
    }
  }

  async function handleDelete(taskId) {
    try {
      setError("");

      await api.delete(`/tasks/${taskId}`);

      await fetchTasks();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to delete task."
      );
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        keyExtractor={(item) => String(item.id)}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListHeaderComponent={
          <View>
            <Text style={styles.heading}>
              Tasks
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Search tasks..."
              value={search}
              onChangeText={setSearch}
            />

            <Text style={styles.label}>
              Status
            </Text>

            <View style={styles.options}>
              {[
                ["", "All"],
                ["Pending", "Pending"],
                ["In Progress", "In Progress"],
                ["Completed", "Completed"],
              ].map(([value, label]) => (
                <Pressable
                  key={label}
                  style={[
                    styles.option,
                    status === value &&
                      styles.selectedOption,
                  ]}
                  onPress={() => setStatus(value)}
                >
                  <Text>{label}</Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.label}>
              Priority
            </Text>

            <View style={styles.options}>
              {[
                ["", "All"],
                ["Low", "Low"],
                ["Medium", "Medium"],
                ["High", "High"],
              ].map(([value, label]) => (
                <Pressable
                  key={label}
                  style={[
                    styles.option,
                    priority === value &&
                      styles.selectedOption,
                  ]}
                  onPress={() =>
                    setPriority(value)
                  }
                >
                  <Text>{label}</Text>
                </Pressable>
              ))}
            </View>

            <Pressable
              style={styles.newButton}
              onPress={openCreateForm}
            >
              <Text style={styles.buttonText}>
                New Task
              </Text>
            </Pressable>

            {showForm && (
              <TaskForm
                task={editingTask}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setEditingTask(null);
                }}
                loading={saving}
              />
            )}

            {error ? (
              <Text style={styles.error}>
                {error}
              </Text>
            ) : null}
          </View>
        }
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onEdit={openEditForm}
            onDelete={handleDelete}
            onComplete={handleComplete}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>
            No tasks found.
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
  },

  heading: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 16,
  },

  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 7,
    paddingHorizontal: 12,
    paddingVertical: 11,
    marginBottom: 14,
  },

  label: {
    fontWeight: "600",
    marginBottom: 8,
  },

  options: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },

  option: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#fff",
  },

  selectedOption: {
    backgroundColor: "#e5e7eb",
    borderColor: "#222",
  },

  newButton: {
    backgroundColor: "#222",
    paddingVertical: 12,
    borderRadius: 7,
    alignItems: "center",
    marginBottom: 16,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },

  error: {
    color: "#b91c1c",
    marginBottom: 12,
  },

  empty: {
    textAlign: "center",
    color: "#666",
    marginTop: 30,
  },
});
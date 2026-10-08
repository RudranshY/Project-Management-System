import { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const initialForm = {
  name: "",
  description: "",
  priority: "Medium",
  status: "Pending",
  due_date: "",
};

export default function TaskForm({
  task,
  onSubmit,
  onCancel,
  loading,
}) {
  const [formData, setFormData] =
    useState(initialForm);

  const [error, setError] = useState("");

  useEffect(() => {
    if (task) {
      setFormData({
        name: task.name || "",
        description: task.description || "",
        priority: task.priority || "Medium",
        status: task.status || "Pending",
        due_date: task.due_date
  ? task.due_date.slice(0, 10)
  : "",
      });
    } else {
      setFormData(initialForm);
    }

    setError("");
  }, [task]);

  function updateField(field, value) {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function handleSubmit() {
    setError("");

    if (!formData.name.trim()) {
      setError("Task name is required.");
      return;
    }

    if (formData.name.trim().length > 150) {
      setError(
        "Task name must be 150 characters or less."
      );
      return;
    }

    onSubmit(formData);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        {task ? "Edit Task" : "Create Task"}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Task name"
        placeholderTextColor="#6b7280"
        value={formData.name}
        onChangeText={(value) =>
          updateField("name", value)
        }
      />

      <TextInput
        style={[
          styles.input,
          styles.textarea,
        ]}
        placeholder="Description"
        placeholderTextColor="#6b7280"
        multiline
        value={formData.description}
        onChangeText={(value) =>
          updateField("description", value)
        }
      />

      <Text style={styles.label}>Priority</Text>

      <View style={styles.options}>
        {["Low", "Medium", "High"].map((value) => (
          <Pressable
            key={value}
            style={[
              styles.option,
              formData.priority === value &&
                styles.selectedOption,
            ]}
            onPress={() =>
              updateField("priority", value)
            }
          >
            <Text>{value}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Status</Text>

      <View style={styles.options}>
        {[
          "Pending",
          "In Progress",
          "Completed",
        ].map((value) => (
          <Pressable
            key={value}
            style={[
              styles.option,
              formData.status === value &&
                styles.selectedOption,
            ]}
            onPress={() =>
              updateField("status", value)
            }
          >
            <Text>{value}</Text>
          </Pressable>
        ))}
      </View>

      <TextInput
        style={styles.input}
        placeholder="Due date (YYYY-MM-DD)"
        placeholderTextColor="#6b7280"
        value={formData.due_date}
        onChangeText={(value) =>
          updateField("due_date", value)
        }
      />

      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : null}

      <Pressable
        style={styles.button}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading
            ? "Saving..."
            : task
            ? "Update Task"
            : "Create Task"}
        </Text>
      </Pressable>

      <Pressable
        style={styles.cancelButton}
        onPress={onCancel}
        disabled={loading}
      >
        <Text>Cancel</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },

  heading: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },

  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 7,
    paddingHorizontal: 12,
    paddingVertical: 11,
    marginBottom: 12,
    backgroundColor: "#fff",
    color: "#111827",
  },

  textarea: {
    minHeight: 90,
    textAlignVertical: "top",
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
  },

  selectedOption: {
    borderColor: "#222",
    backgroundColor: "#e5e7eb",
  },

  button: {
    backgroundColor: "#222",
    paddingVertical: 12,
    borderRadius: 7,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },

  cancelButton: {
    alignItems: "center",
    marginTop: 12,
    paddingVertical: 10,
  },

  error: {
    color: "#b91c1c",
    marginBottom: 10,
  },
});
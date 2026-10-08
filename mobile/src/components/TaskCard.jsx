import { Pressable, StyleSheet, Text, View } from "react-native";

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  onComplete,
}) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.name}>
          {task.name}
        </Text>

        <Text style={styles.status}>
          {task.status}
        </Text>
      </View>

      <Text style={styles.description}>
        {task.description ||
          "No description provided."}
      </Text>

      <Text style={styles.meta}>
        Priority: {task.priority}
      </Text>

      <Text style={styles.meta}>
        Due: {task.due_date
  ? new Date(task.due_date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  : "Not set"}
      </Text>

      <View style={styles.actions}>
        {task.status !== "Completed" && (
          <Pressable
            style={styles.action}
            onPress={() => onComplete(task)}
          >
            <Text>Complete</Text>
          </Pressable>
        )}

        <Pressable
          style={styles.action}
          onPress={() => onEdit(task)}
        >
          <Text>Edit</Text>
        </Pressable>

        <Pressable
          style={styles.action}
          onPress={() => onDelete(task.id)}
        >
          <Text>Delete</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },

  name: {
    flex: 1,
    fontSize: 17,
    fontWeight: "600",
  },

  status: {
    fontSize: 12,
    color: "#555",
  },

  description: {
    color: "#666",
    marginVertical: 10,
  },

  meta: {
    color: "#666",
    fontSize: 13,
    marginTop: 4,
  },

  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 14,
  },

  action: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
});
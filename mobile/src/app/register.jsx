import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { Link, useRouter } from "expo-router";

import { useAuth } from "../context/AuthContext";

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    setError("");

    if (!fullName.trim() || !email.trim() || !password) {
      setError("All fields are required.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    try {
      setLoading(true);

      await register({
        full_name: fullName.trim(),
        email: email.trim(),
        password,
      });

      router.replace("/login");
    } catch (error) {
      if (error.code === "ERR_NETWORK") {
        setError(
          "Unable to connect to the server. Check your network connection."
        );
      } else {
        setError(
          error.response?.data?.message ||
            "Unable to register."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        style={styles.input}
        placeholder="Full name"
        value={fullName}
        onChangeText={setFullName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : null}

      <Pressable
        style={styles.button}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            Create Account
          </Text>
        )}
      </Pressable>

      <Link href="/login" style={styles.link}>
        Already have an account? Login
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#f5f6f8",
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 24,
  },

  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 14,
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
    marginBottom: 12,
  },

  link: {
    textAlign: "center",
    marginTop: 20,
    fontWeight: "600",
  },
});
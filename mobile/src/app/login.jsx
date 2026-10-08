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

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError("");

    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);

      await login({
        email: email.trim(),
        password,
      });

      router.replace("/dashboard");
    } catch (error) {
      if (error.code === "ERR_NETWORK") {
        setError(
          "Unable to connect to the server. Check your network connection."
        );
      } else {
        setError(
          error.response?.data?.message ||
            "Unable to log in."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Project Manager</Text>

      <Text style={styles.heading}>Login</Text>

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
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </Pressable>

      <Text style={styles.footerText}>
        Don't have an account?
      </Text>

      <Link href="/register" style={styles.link}>
        Register
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
    marginBottom: 30,
    textAlign: "center",
  },

  heading: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
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
    marginTop: 4,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },

  error: {
    color: "#b91c1c",
    marginBottom: 12,
  },

  footerText: {
    marginTop: 20,
    textAlign: "center",
    color: "#555",
  },

  link: {
    marginTop: 6,
    textAlign: "center",
    fontWeight: "600",
  },
});
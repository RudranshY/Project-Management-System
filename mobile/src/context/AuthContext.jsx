import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { DeviceEventEmitter } from "react-native";
import * as SecureStore from "expo-secure-store";

import api from "../services/api";

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authMessage, setAuthMessage] = useState("");

  // Listen for authentication/session-expired events
  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      "auth:expired",
      (message) => {
        setUser(null);

        setAuthMessage(
          message ||
            "Your session has expired. Please log in again."
        );
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  async function login(credentials) {
    const response = await api.post(
      "/auth/login",
      credentials
    );

    await SecureStore.setItemAsync(
      "auth_token",
      response.data.token
    );

    // Clear any previous session-expired message
    setAuthMessage("");

    setUser(response.data.user);
  }

  async function register(userData) {
    await api.post("/auth/register", userData);
  }

  async function logout() {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      // Remove local token even if the API request fails.
    }

    await SecureStore.deleteItemAsync("auth_token");

    setUser(null);
  }

  async function loadCurrentUser() {
    try {
      const token = await SecureStore.getItemAsync(
        "auth_token"
      );

      if (!token) {
        setLoading(false);
        return;
      }

      const response = await api.get("/auth/me");

      setUser(response.data.user);
    } catch (error) {
      await SecureStore.deleteItemAsync("auth_token");

      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCurrentUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authMessage,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  return useContext(AuthContext);
}

export { AuthProvider, useAuth };
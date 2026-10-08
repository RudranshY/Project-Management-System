import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api";

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function login(credentials) {
    const response = await api.post("/auth/login", credentials);

    localStorage.setItem("token", response.data.token);

    setUser(response.data.user);
  }

  async function register(userData) {
    await api.post("/auth/register", userData);
  }

  async function logout() {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      // The token is removed even if the request fails.
    }

    localStorage.removeItem("token");
    setUser(null);
  }

  async function loadCurrentUser() {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get("/auth/me");

      setUser(response.data.user);
    } catch (error) {
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
  function handleAuthExpired() {
    setUser(null);
    setLoading(false);
  }

  window.addEventListener(
    "auth:expired",
    handleAuthExpired
  );

  return () => {
    window.removeEventListener(
      "auth:expired",
      handleAuthExpired
    );
  };
}, []);

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  return useContext(AuthContext);
}

export { AuthProvider, useAuth };
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      const message =
        error.response?.data?.message ||
        "Your session has expired. Please log in again.";

      localStorage.removeItem("token");

      sessionStorage.setItem("authMessage", message);

      window.dispatchEvent(new Event("auth:expired"));
    }

    return Promise.reject(error);
  }
);
export default api;
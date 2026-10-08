import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { DeviceEventEmitter } from "react-native";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("auth_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    if (error.response?.status === 401) {
      const token = await SecureStore.getItemAsync(
        "auth_token"
      );

      if (token) {
        const message =
          error.response?.data?.message ||
          "Your session has expired. Please log in again.";

        await SecureStore.deleteItemAsync(
          "auth_token"
        );

        DeviceEventEmitter.emit(
          "auth:expired",
          message
        );
      }
    }

    return Promise.reject(error);
  }
);

export default api;
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// API Base URL - adjust for your environment
const getBaseURL = () => {
  if (__DEV__) {
    // Development
    if (Platform.OS === "android") {
      return "http://10.0.2.2:3000"; // Android emulator
    }
    return "http://localhost:3000"; // iOS simulator or web
  }
  // Production
  return "https://api.yourdomain.com";
};

export const API_BASE_URL = getBaseURL();

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      await AsyncStorage.removeItem("auth_token");
      await AsyncStorage.removeItem("user");
    }
    return Promise.reject(error);
  },
);

// Auth API endpoints
export const authAPI = {
  signup: async (data: {
    username: string;
    email: string;
    password: string;
  }) => {
    const response = await api.post("/api/auth/signup", data);
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await api.post("/api/auth/login", data);
    return response.data;
  },

  getWallet: async () => {
    const response = await api.get("/api/auth/wallet");
    return response.data;
  },

  toggleBiometric: async (enabled: boolean) => {
    const response = await api.patch("/api/auth/biometric", {
      biometricEnabled: enabled,
    });
    return response.data;
  },

  exportPrivateKey: async (password: string) => {
    const response = await api.post("/api/auth/export-private-key", {
      password,
    });
    return response.data;
  },
};

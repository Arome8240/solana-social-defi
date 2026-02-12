import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  walletAddress: string;
  biometricEnabled: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,

  setAuth: async (user, token) => {
    await AsyncStorage.setItem("auth_token", token);
    await AsyncStorage.setItem("user", JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },

  logout: async () => {
    await AsyncStorage.removeItem("auth_token");
    await AsyncStorage.removeItem("user");
    set({ user: null, token: null, isAuthenticated: false });
    router.replace("/(auth)/login");
  },

  initialize: async () => {
    try {
      const token = await AsyncStorage.getItem("auth_token");
      const userStr = await AsyncStorage.getItem("user");

      if (token && userStr) {
        const user = JSON.parse(userStr);
        set({ user, token, isAuthenticated: true, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error("Failed to initialize auth:", error);
      set({ isLoading: false });
    }
  },
}));

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "@/lib/api";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,

      login: async (email: string, password: string) => {
        try {
          const response = await api.login({ email, password });

          if (response.success) {
            set({ user: response.data.user, token: response.data.token });
            // Set cookie for middleware
            document.cookie = `token=${response.data.token}; path=/; max-age=${
              7 * 24 * 60 * 60
            }`;
            return { success: true };
          }

          return { success: false, error: response.error || "Login failed" };
        } catch (error) {
          return { success: false, error: "Network error" };
        }
      },

      register: async (name: string, email: string, password: string) => {
        try {
          const response = await api.register({ name, email, password });

          if (response.success) {
            set({ user: response.data.user, token: response.data.token });
            // Set cookie for middleware
            document.cookie = `token=${response.data.token}; path=/; max-age=${
              7 * 24 * 60 * 60
            }`;
            return { success: true };
          }

          return {
            success: false,
            error: response.error || "Registration failed",
          };
        } catch (error) {
          return { success: false, error: "Network error" };
        }
      },

      logout: () => {
        set({ user: null, token: null });
        // Clear cookie
        document.cookie =
          "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        // Clear localStorage
        localStorage.removeItem("auth-storage");
        // Redirect to login
        window.location.href = "/login";
      },

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
    }),
    {
      name: "auth-storage",
    }
  )
);

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Role = "patient" | "physio";

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: any | null;
  role: Role | null;

  hasHydrated: boolean;

  setAuth: (data: {
    accessToken: string;
    refreshToken: string;
    user: any;
  }) => void;

  setAccessToken: (token: string) => void;
  setRole: (role: Role) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      role: null, // ✅ FIXED

      hasHydrated: false,

      setAuth: ({ accessToken, refreshToken, user }) =>
        set({
          accessToken,
          refreshToken,
          user,
          role: user?.userType ?? null, // ✅ auto-sync role
        }),

      setAccessToken: (token) =>
        set({ accessToken: token }),

      setRole: (role) =>
        set({ role }),

      logout: () =>
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          role: null, // ✅ FIXED
        }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),

      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hasHydrated = true;
        }
      },
    }
  )
);
    
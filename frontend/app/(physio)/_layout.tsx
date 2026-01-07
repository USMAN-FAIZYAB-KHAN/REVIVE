import { Stack, Redirect } from "expo-router";
import { useAuthStore } from "@/store/authStore";

export default function PhysioLayout() {
  const { accessToken, role, hasHydrated } = useAuthStore();

  if (!hasHydrated) return null;

  if (!accessToken || role !== "physio") {
    return <Redirect href="/(auth)/login" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

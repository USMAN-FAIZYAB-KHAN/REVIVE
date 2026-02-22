// import { Stack, Redirect } from "expo-router";
// import { useAuthStore } from "@/store/authStore";

// export default function PatientLayout() {
//   const { accessToken, role, hasHydrated } = useAuthStore();

//   if (!hasHydrated) return null;

//   if (!accessToken || role !== "patient") {
//     return <Redirect href="/(auth)/login" />;
//   }

//   return <Stack screenOptions={{ headerShown: false }} />;
// }


import { Stack, Redirect } from "expo-router";
import { useAuthStore } from "@/store/authStore";

export default function PatientLayout() {
  const { accessToken, role, hasHydrated } = useAuthStore();

  if (!hasHydrated) return null;

  if (!accessToken || role !== "patient") {
    return <Redirect href="/(auth)/login" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

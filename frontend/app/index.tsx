// import { Redirect } from 'expo-router';

// export default function Index() {
//   return <Redirect href="/(auth)/signup" />;
// }

import { Redirect } from "expo-router";
import { useAuthStore } from "@/store/authStore";
import { ActivityIndicator, View } from "react-native";
import { useEffect } from "react";

export default function Index() {
  const { accessToken, hasHydrated } = useAuthStore();

  useEffect(()=>{
    console.log("Auth State Hydrated:", hasHydrated);
    console.log("Access Token:", accessToken);
    console.log("User is logged in:", !!accessToken);
  })

  // ⏳ Wait for persisted state
  if (!hasHydrated) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!accessToken) {
    return <Redirect href="/(auth)/signup" />;
  }

  // return <Redirect href="/(patient)/home" />;
}


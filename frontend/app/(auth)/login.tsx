import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import {
  GoogleSignin,
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";
import { useRouter, Link } from "expo-router";
import { loginApi } from "@/lib/auth.api";
import { useAuthStore } from "@/store/authStore";

export default function LoginScreen() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const [form, setForm] = useState({
    email: "",
    password: "",
    authType: "",
    idToken: "",
  });

  const handleManualLogin = async () => {
    const { email, password } = form;

    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    const finalForm = { ...form, authType: "manual" as const };

    const response = await loginApi(finalForm);
    console.log("Login Response:", response);

    let message = response?.message || "Login successful.";
    alert(message);
    if (response.data?.data) {
      const { accessToken, refreshToken, user } = response.data.data;
      console.log("User Data:", "entered");

      setAuth({
        accessToken,
        refreshToken,
        user: {
          fullName: user.fullName,
          email: user.email,
          age: user.age,
          dateOfBirth: user.dateOfBirth,
        },
      });

      setRole(user.userType);
    }

    // TODO: Add your fetch() call to your Node.js backend here
    console.log("Logging in with:", email);

    // On success, redirect to dashboard (e.g., app/(main)/index)
    router.replace("/(patient)/home");
  };

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (response.type === "success") {
        // Since they are logging in, we check if they already have a role
        // For now, we navigate to the main app
        console.log("Google Login Success:", response.data.user.email);
        // router.replace("/(main)/dashboard");
      }
    } catch (error) {
      Alert.alert("Login Error", "Google Sign-in failed. Please try again.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Log in to continue your recovery</Text>

      {/* Input Fields */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={(val) => setForm({ ...form, email: val })}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        secureTextEntry
        onChangeText={(val) => setForm({ ...form, password: val })}
      />

      <TouchableOpacity style={styles.loginButton} onPress={handleManualLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>

      <View style={styles.dividerContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>OR</Text>
        <View style={styles.line} />
      </View>

      <GoogleSigninButton
        style={styles.googleButton}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={handleGoogleLogin}
      />

      {/* Navigation to Signup */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <Link href="/(auth)/signup" asChild>
          <TouchableOpacity>
            <Text style={styles.signupLink}>Sign Up</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  title: { fontSize: 28, fontWeight: "bold", color: "#333" },
  subtitle: { fontSize: 16, color: "#666", marginBottom: 30 },
  input: {
    backgroundColor: "#F5F5F5",
    color: "#333",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  loginButton: {
    backgroundColor: "#4285F4",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 30,
  },
  line: { flex: 1, height: 1, backgroundColor: "#E0E0E0" },
  orText: { marginHorizontal: 10, color: "#999" },
  googleButton: { width: "100%", height: 60 },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 30 },
  footerText: { color: "#666", fontSize: 14 },
  signupLink: { color: "#4285F4", fontSize: 14, fontWeight: "bold" },
});

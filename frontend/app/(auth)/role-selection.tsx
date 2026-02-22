import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { signupApi } from "@/lib/auth.api";
import axios from "axios";

export default function RoleSelection() {
  const router = useRouter();
  const params = useLocalSearchParams(); // Get user data from previous screen

  const finishRegistration = async (selectedRole: "patient" | "physio") => {
    const finalUserData = { ...params, role: selectedRole };

    console.log("Sending to Backend:", finalUserData);

    try {
      const response = await signupApi(finalUserData);

      // Axios only enters try block for 2xx
      if (response.status === 200 || response.status === 201) {
        console.log("Registration Response:", response.data);

        let status = response.data?.status;
        let message = response.data?.message || "Registration successful.";

        switch (status) {
          case 400:
            alert("Invalid input. Please check your details or passwords.");
            break;

          case 401:
            alert("Unauthorized request. Please try again.");
            break;

          case 409:
            alert("User already exists. Please log in.");
            break;

          case 500:
            alert("Server error. Please try again later.");
            break;

          default:
            alert(message);
        }

        router.replace("/(auth)/login");
        return;
      }
    } catch (error: any) {
      // Axios error
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message =
          error.response?.data?.message ||
          "Something went wrong. Please try again.";

        switch (status) {
          case 400:
            alert("Invalid input. Please check your details or passwords.");
            break;

          case 401:
            alert("Unauthorized request. Please try again.");
            break;

          case 409:
            alert("User already exists. Please log in.");
            break;

          case 500:
            alert("Server error. Please try again later.");
            break;

          default:
            alert(message);
        }
      } else {
        // Non-Axios error
        alert("Unexpected error occurred.");
      }

      console.error("Registration Error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tell us about yourself</Text>
      <Text style={styles.subHeader}>
        Are you here for treatment or to provide it?
      </Text>

      <TouchableOpacity
        style={[styles.card, { borderColor: "#4285F4" }]}
        onPress={() => finishRegistration("patient")}
      >
        <Text style={styles.cardEmoji}>🏃</Text>
        <Text style={styles.cardTitle}>I am a Patient</Text>
        <Text style={styles.cardDesc}>
          I want to recover from a knee injury.
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.card, { borderColor: "#34A853" }]}
        onPress={() => finishRegistration("physio")}
      >
        <Text style={styles.cardEmoji}>🩺</Text>
        <Text style={styles.cardTitle}>I am a Physio</Text>
        <Text style={styles.cardDesc}>I am a therapist managing patients.</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  header: { fontSize: 24, fontWeight: "bold", textAlign: "center" },
  subHeader: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 40,
  },
  card: {
    borderWidth: 2,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  cardEmoji: { fontSize: 40, marginBottom: 10 },
  cardTitle: { fontSize: 18, fontWeight: "bold" },
  cardDesc: { textAlign: "center", color: "#777", marginTop: 5 },
});

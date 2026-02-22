import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function PatientHome() {
  const router = useRouter();
  const { user, logout, role } = useAuthStore();

  useEffect(()=>{
    console.log("User Role:", role);
    console.log("User Info:", user);
  })

  const handleLogout = () => {
    logout();
    router.replace("/(auth)/login");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.heading}>Patient Dashboard</Text>

      {/* User Info */}
      <View style={styles.card}>
        <Text style={styles.label}>Welcome</Text>
        <Text style={styles.value}>{user?.fullName || "Patient"}</Text>

        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user?.email}</Text>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Book Appointment</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>My Appointments</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F9FAFB",
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 8,
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
  },
  actions: {
    gap: 12,
  },
  button: {
    backgroundColor: "#2563EB",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  logoutButton: {
    marginTop: "auto",
    padding: 14,
    borderRadius: 8,
    backgroundColor: "#EF4444",
    alignItems: "center",
  },
  logoutText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});

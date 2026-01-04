import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function RoleSelection() {
  const router = useRouter();
  const params = useLocalSearchParams(); // Get user data from previous screen

  const finishRegistration = (selectedRole: 'patient' | 'physio') => {
    // Final Data to send to Backend
    const finalUserData = { ...params, role: selectedRole };  
    console.log("Sending to MongoDB Atlas:", finalUserData); 
    // API Call to your Node.js backend would happen here
    // axios.post('/register', finalUserData)...
    
    alert(`Registered successfully as ${selectedRole}!`);
    // router.replace('/home'); // Send to dashboard
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tell us about yourself</Text>
      <Text style={styles.subHeader}>Are you here for treatment or to provide it?</Text>

      <TouchableOpacity 
        style={[styles.card, {borderColor: '#4285F4'}]} 
        onPress={() => finishRegistration('patient')}
      >
        <Text style={styles.cardEmoji}>🏃</Text>
        <Text style={styles.cardTitle}>I am a Patient</Text>
        <Text style={styles.cardDesc}>I want to recover from a knee injury.</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.card, {borderColor: '#34A853'}]} 
        onPress={() => finishRegistration('physio')}
      >
        <Text style={styles.cardEmoji}>🩺</Text>
        <Text style={styles.cardTitle}>I am a Physio</Text>
        <Text style={styles.cardDesc}>I am a therapist managing patients.</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', justifyContent: 'center' },
  header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
  subHeader: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 40 },
  card: {
    borderWidth: 2,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  cardEmoji: { fontSize: 40, marginBottom: 10 },
  cardTitle: { fontSize: 18, fontWeight: 'bold' },
  cardDesc: { textAlign: 'center', color: '#777', marginTop: 5 },
});
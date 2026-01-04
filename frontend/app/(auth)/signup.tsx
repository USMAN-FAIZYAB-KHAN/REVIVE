import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { useRouter, Link } from 'expo-router';

export default function SignupScreen() {
  const router = useRouter();
  
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleManualSignup = () => {
    const { fullName, email, password, confirmPassword } = form;

    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    // Navigate to Role Selection with data
    router.push({ 
      pathname: "/(auth)/role-selection", 
      params: { ...form, authType: 'manual' } 
    });
  };

  const handleGoogleSignup = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      
      if (response.type === 'success') {
        router.push({ 
          pathname: "/(auth)/role-selection", 
          params: { 
            email: response.data.user.email, 
            fullName: response.data.user.name,
            googleId: response.data.user.id,
            authType: 'google' 
          } 
        });
      }
    } catch (error) {
      Alert.alert("Google Error", "Could not complete Google Sign-up");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join REVIVE for better recovery</Text>

      <TextInput 
        style={styles.input} 
        placeholder="Full Name" 
        placeholderTextColor="#888888"
        onChangeText={(val) => setForm({...form, fullName: val})}
      />
      <TextInput 
        style={styles.input} 
        placeholder="Email" 
        placeholderTextColor="#888888"
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={(val) => setForm({...form, email: val})}
      />
      <TextInput 
        style={styles.input} 
        placeholder="Password" 
        placeholderTextColor="#888888"
        secureTextEntry 
        onChangeText={(val) => setForm({...form, password: val})}
      />
      <TextInput 
        style={styles.input} 
        placeholder="Confirm Password" 
        placeholderTextColor="#888888"
        secureTextEntry 
        onChangeText={(val) => setForm({...form, confirmPassword: val})}
      />

      <TouchableOpacity style={styles.primaryButton} onPress={handleManualSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
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
        onPress={handleGoogleSignup}
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <Link href="/(auth)/login" asChild>
          <TouchableOpacity>
            <Text style={styles.linkText}>Log In</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </ScrollView>
  );
}

// Global Styles shared by both screens
const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#fff', justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333' },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 30 },
  input: {
    backgroundColor: '#F5F5F5', 
    color: '#333',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  primaryButton: {
    backgroundColor: '#4285F4',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 30 },
  line: { flex: 1, height: 1, backgroundColor: '#E0E0E0' },
  orText: { marginHorizontal: 10, color: '#999' },
  googleButton: { width: '100%', height: 60 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 30 },
  footerText: { color: '#666', fontSize: 14 },
  linkText: { color: '#4285F4', fontSize: 14, fontWeight: 'bold' },
});
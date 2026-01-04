import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(auth)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // 3. Configure Google Sign-In here
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '886648714752-oplvgreekkq4idjpt4ec6tgtksaaa6si.apps.googleusercontent.com',
      offlineAccess: true, // Recommended for backend verification
    });
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} /> 
        <Stack.Screen name="(patient)" options={{ headerShown: false }} />
        <Stack.Screen name="(physio)" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
